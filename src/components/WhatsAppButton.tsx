"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

export interface WhatsAppButtonProps {
    phoneNumber: string;
    message?: string;
    className?: string;
}

/**
 * Floating WhatsApp Button (Russian)
 * Features: Pulse animation, fixed position, mobile-optimized
 */
export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
    phoneNumber,
    message = "Здравствуйте! Хочу узнать подробнее о вашей мебели.",
    className,
}) => {
    const handleClick = () => {
        const cleanPhone = phoneNumber.replace(/\D/g, "");
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110 group",
                "animate-[pulseSoft_2s_infinite]",
                className
            )}
            aria-label="Написать в WhatsApp"
        >
            <FaWhatsapp className="w-7 h-7" />
            <span className="hidden sm:inline font-medium">Написать в WhatsApp</span>

            {/* Pulse Ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" />
        </button>
    );
};
