"use client";

import React, { useState } from "react";
import { formatPrice, cn } from "@/lib/utils";
import {
    calculateInstallment,
    RATES_WITH_DOWNPAYMENT,
    RATES_NO_DOWNPAYMENT
} from "@/utils/installment";
import { FiPercent } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/types/product";

interface InstallmentWidgetProps {
    price: number;
    product: Product;
}

export const InstallmentWidget = ({ price, product }: InstallmentWidgetProps) => {
    // State
    const [hasDownPayment, setHasDownPayment] = useState(true);

    // Initial months selection based on mode
    const [months, setMonths] = useState(6);

    // Handlers
    const handleModeChange = (withDownPayment: boolean) => {
        setHasDownPayment(withDownPayment);

        // Smartly switch months if current selection is invalid for new mode
        const newRates = withDownPayment ? RATES_WITH_DOWNPAYMENT : RATES_NO_DOWNPAYMENT;
        const currentExists = newRates.find(r => r.months === months);

        if (!currentExists) {
            // Pick a reasonable default (e.g., middle option)
            // For No Downpayment (2-10 months), 6 is usually good.
            // For With Downpayment (4-12 months), 6 is also good.
            // If 6 is not available, pick the middle one.
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
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl shadow-neutral-200/40 my-10 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                        <FiPercent className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-neutral-900 leading-none">Рассрочка &quot;Тешам&quot;</h3>
                        <p className="text-xs text-neutral-400 mt-1">Исламская рассрочка (Халяль)</p>
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-neutral-100/80 p-1.5 rounded-2xl mb-8 backdrop-blur-sm">
                    <button
                        onClick={() => handleModeChange(true)}
                        className={cn(
                            "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                            hasDownPayment
                                ? "bg-white text-neutral-900 shadow-md transform scale-[1.02]"
                                : "text-neutral-500 hover:text-neutral-700 hover:bg-white/50"
                        )}
                    >
                        С взносом
                    </button>
                    <button
                        onClick={() => handleModeChange(false)}
                        className={cn(
                            "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                            !hasDownPayment
                                ? "bg-white text-neutral-900 shadow-md transform scale-[1.02]"
                                : "text-neutral-500 hover:text-neutral-700 hover:bg-white/50"
                        )}
                    >
                        Без взноса
                    </button>
                </div>

                {/* Months Selector */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Срок (месяцев)</p>
                        <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded-md">
                            {months} мес.
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {availableMonths.map((m) => (
                            <button
                                key={m}
                                onClick={() => setMonths(m)}
                                className={cn(
                                    "w-11 h-11 rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200 border-2",
                                    months === m
                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/20 scale-110"
                                        : "bg-white text-neutral-600 border-neutral-100 hover:border-neutral-300"
                                )}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Application Summary */}
                <div className="bg-neutral-50/80 rounded-2xl p-6 mb-6 space-y-4 border border-neutral-100">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500 font-medium">Первый взнос</span>
                        <span className="font-bold text-neutral-900 text-lg">{formatPrice(result.downPayment)}</span>
                    </div>

                    <div className="h-px bg-neutral-200/60" />

                    <div className="flex justify-between items-center">
                        <span className="text-neutral-500 text-sm font-medium">Ежемесячно</span>
                        <div className="text-right">
                            <span className="font-bold text-3xl text-green-600 tracking-tight">{formatPrice(result.monthlyPayment)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-2">
                        <span>Наценка: {result.markupPercent}% ({formatPrice(result.markupAmount)})</span>
                        <span>Всего: {formatPrice(result.totalPrice)}</span>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleWhatsappClick}
                    className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all duration-300 shadow-lg shadow-green-200 active:scale-[0.98]"
                >
                    <FaWhatsapp className="w-6 h-6" />
                    Оформить рассрочку
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-neutral-400">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span>Одобрение за 10 минут • Нужен только паспорт</span>
                </div>
            </div>
        </div>
    );
};
