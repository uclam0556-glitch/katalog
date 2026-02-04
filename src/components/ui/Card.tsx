import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "elevated";
    hoverable?: boolean;
    children: React.ReactNode;
}

/**
 * Premium Card Component
 * Features: Glassmorphism, elevation, hover effects
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        { className, variant = "default", hoverable = false, children, ...props },
        ref
    ) => {
        const baseStyles =
            "rounded-2xl transition-all duration-300 overflow-hidden";

        const variants = {
            default: "bg-white border border-neutral-200 shadow-md",
            glass:
                "bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg",
            elevated: "bg-white shadow-xl",
        };

        const hoverStyles = hoverable
            ? "hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
            : "";

        return (
            <div
                ref={ref}
                className={cn(baseStyles, variants[variant], hoverStyles, className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

/**
 * Card Header Component
 */
export const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("px-6 py-4 border-b border-neutral-100", className)}
        {...props}
    />
));

CardHeader.displayName = "CardHeader";

/**
 * Card Content Component
 */
export const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-6 py-4", className)} {...props} />
));

CardContent.displayName = "CardContent";

/**
 * Card Footer Component
 */
export const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("px-6 py-4 border-t border-neutral-100", className)}
        {...props}
    />
));

CardFooter.displayName = "CardFooter";
