"use client";

import React from "react";
import Link from "next/link";
import { FiMapPin, FiPhone, FiSearch, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition"
                >
                    <FiX className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-red-50 rounded-xl">
                        <FiMapPin className="w-6 h-6 text-red-700" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-1">
                            Наш магазин
                        </h3>
                        <p className="text-sm text-neutral-500">
                            Приглашаем вас посетить наш шоурум
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Адрес</p>
                        <p className="text-base text-neutral-900">
                            г. Москва, ул. Примерная, д. 123
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Режим работы</p>
                        <p className="text-base text-neutral-900">
                            Пн-Вс: 10:00 - 21:00
                        </p>
                    </div>

                    <a
                        href="https://yandex.ru/maps"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-center rounded-xl font-medium transition"
                    >
                        Показать на карте
                    </a>
                </div>
            </div>
        </>
    );
};

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition"
                >
                    <FiX className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-green-50 rounded-xl">
                        <FiPhone className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-1">
                            Свяжитесь с нами
                        </h3>
                        <p className="text-sm text-neutral-500">
                            Мы на связи каждый день
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Телефон</p>
                        <a
                            href="tel:+79667422726"
                            className="text-lg text-neutral-900 font-semibold hover:text-red-700 transition"
                        >
                            +7 (966) 742-27-26
                        </a>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Email</p>
                        <a
                            href="mailto:info@amea.ru"
                            className="text-base text-neutral-900 hover:text-red-700 transition"
                        >
                            info@amea.ru
                        </a>
                    </div>

                    <a
                        href="https://wa.me/79667422726"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white text-center rounded-xl font-medium transition flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Написать в WhatsApp
                    </a>
                </div>
            </div>
        </>
    );
};

/**
 * Premium Header - Shatura-inspired  
 * Logo centered, clean search
 */
export const HeaderNew: React.FC = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isLocationOpen, setIsLocationOpen] = React.useState(false);
    const [isContactOpen, setIsContactOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-40 bg-white transition-all duration-300",
                    isScrolled ? "shadow-md" : "border-b border-neutral-200"
                )}
            >
                <div className="container mx-auto px-3 md:px-4 max-w-7xl">
                    {/* Top Row: Logo centered, actions on sides */}
                    <div className="flex items-center justify-between h-16 md:h-20 gap-2">
                        {/* Left: Location (desktop) */}
                        <div className="hidden md:block flex-1">
                            <button
                                onClick={() => setIsLocationOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 rounded-lg transition text-sm font-medium text-neutral-700"
                            >
                                <FiMapPin className="w-4 h-4" />
                                <span>Москва</span>
                            </button>
                        </div>

                        {/* Center: Logo - Bigger and centered */}
                        <Link
                            href="/"
                            className="flex items-center justify-center hover:opacity-80 transition"
                        >
                            <h1
                                className="text-3xl md:text-4xl font-black tracking-tight"
                                style={{
                                    color: "#991B1B",
                                    fontFamily: "var(--font-serif)",
                                }}
                            >
                                амэа
                            </h1>
                        </Link>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
                            {/* Mobile: Location + Contact icons */}
                            <button
                                onClick={() => setIsLocationOpen(true)}
                                className="md:hidden p-2 hover:bg-neutral-50 rounded-lg transition"
                            >
                                <FiMapPin className="w-5 h-5 text-neutral-700" />
                            </button>

                            <button
                                onClick={() => setIsContactOpen(true)}
                                className="md:hidden p-2 hover:bg-neutral-50 rounded-lg transition"
                            >
                                <FiPhone className="w-5 h-5 text-neutral-700" />
                            </button>

                            {/* Desktop: Contact Button */}
                            <button
                                onClick={() => setIsContactOpen(true)}
                                className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 rounded-lg transition font-medium text-neutral-900"
                            >
                                <FiPhone className="w-4 h-4" />
                                <span className="text-sm">Контакты</span>
                            </button>

                            <Link
                                href="/catalog"
                                className="px-4 md:px-6 py-2 md:py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium transition text-sm"
                            >
                                Каталог
                            </Link>
                        </div>
                    </div>

                    {/* Search Row - Full width below */}
                    <div className="pb-3">
                        <div className="relative max-w-2xl mx-auto">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Поиск мебели..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 transition text-sm"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Modals */}
            <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
};
