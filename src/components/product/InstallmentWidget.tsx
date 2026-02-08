"use client";

import React, { useState } from "react";
import { formatPrice, cn } from "@/lib/utils";
import {
    calculateInstallment,
    RATES_WITH_DOWNPAYMENT,
    RATES_NO_DOWNPAYMENT
} from "@/utils/installment";
import { FiCheck, FiInfo } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/types/product";

interface InstallmentWidgetProps {
    price: number;
    product: Product;
}

export const InstallmentWidget = ({ price, product }: InstallmentWidgetProps) => {
    // State
    const [hasDownPayment, setHasDownPayment] = useState(true);
    const [months, setMonths] = useState(6);

    // Handlers
    const handleModeChange = (withDownPayment: boolean) => {
        setHasDownPayment(withDownPayment);
        const newRates = withDownPayment ? RATES_WITH_DOWNPAYMENT : RATES_NO_DOWNPAYMENT;
        const currentExists = newRates.find(r => r.months === months);

        if (!currentExists) {
            const defaultMonth = newRates.find(r => r.months === 6)
                ? 6
                : newRates[Math.floor(newRates.length / 2)].months;
            setMonths(defaultMonth);
        }
    };

    // Derived Logic
    const result = calculateInstallment(price, months, hasDownPayment);
    if (!result) return null;

    const availableMonths = hasDownPayment
        ? RATES_WITH_DOWNPAYMENT.map(r => r.months)
        : RATES_NO_DOWNPAYMENT.map(r => r.months);

    const handleWhatsappClick = () => {
        const message =
            `Здравствуйте! 👋\n` +
            `Хочу оформить рассрочку на: *${product.name}*\n` +
            `Цена: ${formatPrice(price)}\n` +
            `------------------\n` +
            `План: ${hasDownPayment ? "С взносом" : "Без взноса"}\n` +
            `Срок: ${months} мес.\n` +
            `Взнос: ${formatPrice(result.downPayment)}\n` +
            `Ежемесячно: ${formatPrice(result.monthlyPayment)}\n` +
            `Итого: ${formatPrice(result.totalPrice)}\n` +
            `\nСсылка: ${window.location.href}`;

        window.open(`https://wa.me/79667422726?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-neutral-200/40 overflow-hidden border border-neutral-100 my-8">
            {/* Header / Toggle Section */}
            <div className="bg-neutral-50 px-6 py-8 border-b border-neutral-100 flex flex-col items-center">

                {/* Title Section */}
                <div className="flex flex-col items-center text-center relative mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-3 py-1.5 rounded-full mb-3 scale-110">
                        Халяль
                    </span>
                    <h3 className="font-bold text-2xl text-neutral-900 leading-none mb-1">Рассрочка</h3>
                    <p className="text-sm text-neutral-500 font-medium">Без банка • Без процентов</p>
                </div>

                {/* Segmented Control */}
                <div className="bg-neutral-200/50 p-1 rounded-xl flex relative w-full">
                    <button
                        onClick={() => handleModeChange(true)}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300",
                            hasDownPayment
                                ? "bg-white text-neutral-900 shadow-sm"
                                : "text-neutral-500 hover:text-neutral-700"
                        )}
                    >
                        С взносом (20%)
                    </button>
                    <button
                        onClick={() => handleModeChange(false)}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300",
                            !hasDownPayment
                                ? "bg-white text-neutral-900 shadow-sm"
                                : "text-neutral-500 hover:text-neutral-700"
                        )}
                    >
                        Без взноса
                    </button>
                </div>
            </div>

            <div className="p-6 md:p-8">
                {/* Month Selection */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Срок (В месяцах)</p>
                    <div className="flex flex-wrap gap-3">
                        {availableMonths.map((m) => (
                            <button
                                key={m}
                                onClick={() => setMonths(m)}
                                className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-200 border-2",
                                    months === m
                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/20 scale-105"
                                        : "bg-white text-neutral-500 border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50"
                                )}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Result Display - Modern Clean Layout */}
                <div className="flex flex-col gap-6">
                    {/* Primary Number */}
                    <div className="text-center bg-green-50/50 rounded-2xl p-6 border border-green-100">
                        <p className="text-sm text-neutral-500 font-medium mb-1">Ваш платеж в месяц</p>
                        <p className="text-4xl md:text-5xl font-bold text-green-700 tracking-tight leading-none">
                            {formatPrice(result.monthlyPayment)}
                        </p>
                    </div>

                    {/* Secondary Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                            <p className="text-[11px] text-neutral-400 uppercase font-bold mb-1">Первый взнос</p>
                            <p className="text-lg font-bold text-neutral-900">{formatPrice(result.downPayment)}</p>
                        </div>
                        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                            <p className="text-[11px] text-neutral-400 uppercase font-bold mb-1">Общая сумма</p>
                            <p className="text-lg font-bold text-neutral-900">{formatPrice(result.totalPrice)}</p>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Button */}
                <button
                    onClick={handleWhatsappClick}
                    className="w-full mt-8 py-4 bg-neutral-900 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-black transition-all duration-300 shadow-lg shadow-neutral-900/20 active:scale-[0.98]"
                >
                    <FaWhatsapp className="w-6 h-6 text-[#25D366]" />
                    <span>Оформить заявку</span>
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                    <div className="flex -space-x-2">
                        <div className="w-5 h-5 rounded-full bg-neutral-200 border-2 border-white" />
                        <div className="w-5 h-5 rounded-full bg-neutral-300 border-2 border-white" />
                        <div className="w-5 h-5 rounded-full bg-neutral-400 border-2 border-white items-center justify-center flex text-[8px] text-white font-bold">+</div>
                    </div>
                    <span>Более 100+ одобрений сегодня</span>
                </div>
            </div>
        </div >
    );
};
