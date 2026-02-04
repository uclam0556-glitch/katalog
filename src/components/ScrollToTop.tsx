"use client";

import React from "react";
import { FiArrowUp } from "react-icons/fi";
import { cn } from "@/lib/utils";

/**
 * Scroll to Top Button (Russian)
 * Appears when user scrolls down
 */
export const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                "fixed bottom-6 left-6 z-40 p-4 bg-gradient-to-r from-primary-400 to-primary-600 text-neutral-900 rounded-full shadow-warm transition-all duration-300 hover:shadow-xl hover:scale-110",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
            )}
            aria-label="Наверх"
        >
            <FiArrowUp className="w-6 h-6" />
        </button>
    );
};
