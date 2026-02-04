"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    cta?: {
        text: string;
        href: string;
    };
}

const slides: Slide[] = [
    {
        id: 1,
        title: "Новая коллекция 2026",
        subtitle: "Современная мебель для вашего дома",
        image: "/hero_slide_living.png",
        cta: {
            text: "Смотреть каталог",
            href: "/catalog",
        },
    },
    {
        id: 2,
        title: "Бесплатная доставка",
        subtitle: "При заказе от 50 000₽",
        image: "/hero_slide_bedroom.png",
    },
    {
        id: 3,
        title: "Мебель на заказ",
        subtitle: "Индивидуальные размеры и дизайн",
        image: "/hero_slide_kitchen.png",
        cta: {
            text: "Узнать подробнее",
            href: "/catalog",
        },
    },
];

export const HeroSlider: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-rotate every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-neutral-100">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-700",
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    {/* Background Image */}
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="100vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4 max-w-7xl">
                            <div className="max-w-2xl text-white">
                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-lg md:text-2xl mb-6 md:mb-8 opacity-90">
                                    {slide.subtitle}
                                </p>
                                {slide.cta && (
                                    <Link
                                        href={slide.cta.href}
                                        className="inline-block px-8 py-4 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {slide.cta.text}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Dots Navigation */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all",
                            index === currentSlide
                                ? "bg-white w-8"
                                : "bg-white/50 hover:bg-white/75"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
