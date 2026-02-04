"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

/**
 * Modern Button - Clean with smooth animations
 */
export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    className,
    children,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
        primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg",
        secondary: "bg-neutral-800 text-white hover:bg-neutral-900 shadow-md hover:shadow-lg",
        outline: "border-2 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50",
        ghost: "text-neutral-700 hover:bg-neutral-100",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#20BA5A] shadow-md hover:shadow-lg",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};
