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
        <div className="relative group rounded-[2.5rem] p-1 bg-gradient-to-br from-neutral-200 via-neutral-100 to-white shadow-2xl shadow-neutral-200/50 my-12 overflow-hidden transform transition-all hover:scale-[1.01]">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl z-0" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <div className="relative z-10 bg-white/40 backdrop-blur-md rounded-[2.2rem] p-6 md:p-8 border border-white/50">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-200 transform rotate-3">
                            <FiPercent className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-2xl text-neutral-900 leading-none tracking-tight">Рассрочка &quot;Тешам&quot;</h3>
                            <p className="text-sm text-neutral-500 mt-1 font-medium">Без скрытых комиссий • Халяль</p>
                        </div>
                    </div>
                </div>

                {/* Mode Toggle - Glassmorphism */}
                <div className="flex bg-neutral-900/5 p-1.5 rounded-2xl mb-8 relative overflow-hidden">
                    <div
                        className={cn(
                            "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-500 ease-out",
                            hasDownPayment ? "left-1.5" : "translate-x-[100%] left-1.5"
                        )}
                    />
                    <button
                        onClick={() => handleModeChange(true)}
                        className={cn(
                            "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10",
                            hasDownPayment
                                ? "text-neutral-900"
                                : "text-neutral-500 hover:text-neutral-700"
                        )}
                    >
                        С взносом (20%)
                    </button>
                    <button
                        onClick={() => handleModeChange(false)}
                        className={cn(
                            "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10",
                            !hasDownPayment
                                ? "text-neutral-900"
                                : "text-neutral-500 hover:text-neutral-700"
                        )}
                    >
                        Без взноса
                    </button>
                </div>

                {/* Months Selector */}
                <div className="mb-10">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Выберите срок</p>
                        <span className="text-sm font-serif italic text-neutral-900">
                            {months} месяцев
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        {availableMonths.map((m) => (
                            <button
                                key={m}
                                onClick={() => setMonths(m)}
                                className={cn(
                                    "w-12 h-12 rounded-2xl text-sm font-bold flex items-center justify-center transition-all duration-300 border",
                                    months === m
                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-xl shadow-neutral-900/20 scale-110 -translate-y-1"
                                        : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 hover:-translate-y-0.5"
                                )}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Application Summary - The "Card" Look */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-3xl p-6 mb-8 border border-white shadow-inner relative overflow-hidden">
                    {/* Glossy shine */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

                    <div className="relative z-10 space-y-5">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500 text-sm font-medium">Ваш ежемесячный платеж</span>
                            <div className="text-right">
                                <span className="block font-serif font-bold text-4xl text-emerald-700 tracking-tight drop-shadow-sm">
                                    {formatPrice(result.monthlyPayment)}
                                </span>
                            </div>
                        </div>

                        <div className="h-px bg-neutral-200/60" />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-neutral-400 mb-1">Первый взнос</p>
                                <p className="font-bold text-neutral-900 text-lg">{formatPrice(result.downPayment)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-neutral-400 mb-1">Итоговая стоимость</p>
                                <p className="font-bold text-neutral-900 text-lg">{formatPrice(result.totalPrice)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleWhatsappClick}
                    className="w-full h-16 bg-[#25D366] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#20bd5a] transition-all duration-300 shadow-xl shadow-green-500/30 transform hover:scale-[1.02] active:scale-[0.98] group"
                >
                    <FaWhatsapp className="w-7 h-7 group-hover:rotate-[360deg] transition-transform duration-700" />
                    <span className="tracking-wide">Оформить рассрочку</span>
                </button>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-400 font-medium">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Одобрение за 10 мин</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    <span>По паспорту РФ</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    <span>Возраст 23+</span>
                </div>
            </div>
        </div>
    );
};
