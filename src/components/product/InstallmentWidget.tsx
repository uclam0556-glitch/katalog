"use client";

import React, { useState } from "react";
import { formatPrice, cn } from "@/lib/utils";
import {
    calculateInstallment,
    RATES_WITH_DOWNPAYMENT,
    RATES_NO_DOWNPAYMENT
} from "@/utils/installment";
import { FiInfo } from "react-icons/fi";
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
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden my-6">
            {/* Header Area */}
            <div className="bg-neutral-50/50 px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center shadow-md">
                        <span className="font-serif font-bold text-lg leading-none">%</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-neutral-900 text-sm leading-tight">Рассрочка Тешам</h3>
                        <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wide">Халяль • Без штрафов</p>
                    </div>
                </div>
                {/* Compact Toggle */}
                <div className="flex bg-neutral-200/50 p-1 rounded-lg">
                    <button
                        onClick={() => handleModeChange(true)}
                        className={cn(
                            "px-3 py-1.5 text-[11px] font-bold rounded-md transition-all duration-200",
                            hasDownPayment ? "bg-white text-neutral-900 shadow-sm scale-105" : "text-neutral-500 hover:text-neutral-700"
                        )}
                    >
                        С взносом
                    </button>
                    <button
                        onClick={() => handleModeChange(false)}
                        className={cn(
                            "px-3 py-1.5 text-[11px] font-bold rounded-md transition-all duration-200",
                            !hasDownPayment ? "bg-white text-neutral-900 shadow-sm scale-105" : "text-neutral-500 hover:text-neutral-700"
                        )}
                    >
                        Без взноса
                    </button>
                </div>
            </div>

            <div className="p-5">
                {/* Month Slider (Horizontal Scroll) */}
                <div className="mb-6">
                    <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2">Срок рассрочки (месяцев)</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                        {availableMonths.map((m) => (
                            <button
                                key={m}
                                onClick={() => setMonths(m)}
                                className={cn(
                                    "flex-shrink-0 w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all border",
                                    months === m
                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md transform -translate-y-0.5"
                                        : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                                )}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Calculation - Compact Row */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <p className="text-xs text-neutral-500 mb-1">Ежемесячный платеж</p>
                        <p className="text-2xl font-serif font-bold text-neutral-900 leading-none tracking-tight">
                            {formatPrice(result.monthlyPayment)}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-neutral-400 uppercase font-bold">Первый взнос</span>
                            <span className="text-sm font-bold text-neutral-900 mb-2">{formatPrice(result.downPayment)}</span>

                            <span className="text-[10px] text-neutral-400 uppercase font-bold">Итого</span>
                            <span className="text-sm font-bold text-neutral-500">{formatPrice(result.totalPrice)}</span>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Button - Full Width */}
                <button
                    onClick={handleWhatsappClick}
                    className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] hover:shadow-md"
                >
                    <FaWhatsapp className="w-5 h-5" />
                    Оформить рассрочку
                </button>
                <p className="text-[10px] text-neutral-400 text-center mt-3 flex items-center justify-center gap-1">
                    <FiInfo className="w-3 h-3" />
                    Одобрение за 10 мин • Паспорт РФ
                </p>
            </div>
        </div>
    );
};
