import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "primary" | "secondary" | "accent" | "sage" | "neutral";
    size?: "sm" | "md";
    children: React.ReactNode;
}

/**
 * Premium Badge Component
 * Features: Multiple color variants, sizes, rounded design
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "primary", size = "sm", children, ...props }, ref) => {
        const baseStyles =
            "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200";

        const variants = {
            primary: "bg-primary-100 text-primary-800 border border-primary-200",
            secondary:
                "bg-secondary-100 text-secondary-800 border border-secondary-200",
            accent: "bg-accent-100 text-accent-800 border border-accent-200",
            sage: "bg-sage-100 text-sage-800 border border-sage-200",
            neutral: "bg-neutral-100 text-neutral-800 border border-neutral-200",
        };

        const sizes = {
            sm: "px-2.5 py-0.5 text-xs",
            md: "px-3 py-1 text-sm",
        };

        return (
            <span
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";
