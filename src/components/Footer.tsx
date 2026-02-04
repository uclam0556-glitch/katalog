import React from "react";
import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaTelegram } from "react-icons/fa";

/**
 * Ultra-Premium "Gallery" Footer
 * Minimalist, Light, Typography-focused
 */
export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white text-neutral-900 border-t border-neutral-100 pt-20 pb-10">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">

                    {/* Brand Column (Left) */}
                    <div className="md:col-span-4 flex flex-col items-start">
                        <Link href="/" className="inline-block mb-6 group">
                            <span className="font-serif text-3xl font-bold tracking-tight group-hover:opacity-70 transition-opacity">
                                амэа.
                            </span>
                        </Link>
                        <p className="text-neutral-500 font-light leading-relaxed max-w-xs mb-8">
                            Искусство создавать уют. Премиальная мебель, объединяющая эстетику и комфорт для вашего идеального пространства.
                        </p>

                        {/* Social Links - Minimal */}
                        <div className="flex gap-4">
                            <a
                                href="https://wa.me/79667422726"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-neutral-200 rounded-full flex items-center justify-center text-neutral-600 hover:text-white hover:bg-neutral-900 hover:border-neutral-900 transition-all duration-300"
                                aria-label="WhatsApp"
                            >
                                <FaWhatsapp className="w-4 h-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-neutral-200 rounded-full flex items-center justify-center text-neutral-600 hover:text-white hover:bg-neutral-900 hover:border-neutral-900 transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://t.me"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-neutral-200 rounded-full flex items-center justify-center text-neutral-600 hover:text-white hover:bg-neutral-900 hover:border-neutral-900 transition-all duration-300"
                                aria-label="Telegram"
                            >
                                <FaTelegram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block md:col-span-2" />

                    {/* Navigation Columns */}
                    <div className="md:col-span-2">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-400 mb-6">
                            Меню
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="text-sm font-medium hover:text-neutral-500 transition-colors">
                                    Главная
                                </Link>
                            </li>
                            <li>
                                <Link href="/catalog" className="text-sm font-medium hover:text-neutral-500 transition-colors">
                                    Каталог
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm font-medium hover:text-neutral-500 transition-colors">
                                    О бренде
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacts" className="text-sm font-medium hover:text-neutral-500 transition-colors">
                                    Контакты
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-400 mb-6">
                            Коллекции
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/catalog?category=stulya" className="text-sm font-medium hover:text-neutral-500 transition-colors">
                                    Стулья
                                </Link>
                            </li>
                            <li>
                                <Link href="/catalog?category=stoly" className="text-sm font-medium hover:text-neutral-500 transition-colors">
                                    Столы
                                </Link>
                            </li>
                            <li>
                                <Link href="/catalog?category=divany" className="text-sm font-medium hover:text-neutral-500 transition-colors">
                                    Диваны
                                </Link>
                            </li>
                            <li>
                                <Link href="/catalog?category=stellazhi" className="text-sm font-medium hover:text-neutral-500 transition-colors">
                                    Стеллажи
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-400 mb-6">
                            Связь
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="tel:+79001234567" className="text-sm font-medium hover:text-neutral-500 transition-colors block">
                                    +7 (966) 742-27-26
                                </a>
                                <span className="text-xs text-neutral-400">Ежедневно 9:00 - 21:00</span>
                            </li>
                            <li>
                                <a href="mailto:hello@amea.ru" className="text-sm font-medium hover:text-neutral-500 transition-colors">
                                    hello@amea.ru
                                </a>
                            </li>
                            <li>
                                <p className="text-sm">
                                    <span className="text-neutral-400">Адрес:</span>
                                    <br />
                                    <span className="text-neutral-900 block mt-1">
                                        Село Гойты, <br />
                                        Улица Грозненская 20
                                    </span>
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-neutral-100 text-xs text-neutral-400 font-medium">
                    <p>© {currentYear} AMEA Furniture. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-neutral-900 transition-colors">
                            Политика конфиденциальности
                        </Link>
                        <Link href="/terms" className="hover:text-neutral-900 transition-colors">
                            Публичная оферта
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
