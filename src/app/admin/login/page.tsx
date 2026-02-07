"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiLock } from "react-icons/fi";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const ADMIN_PASSWORD = "turpal2000";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate network delay for "weight"
        await new Promise(r => setTimeout(r, 800));

        if (password === ADMIN_PASSWORD) {
            // Set cookie for 7 days
            const date = new Date();
            date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = "admin_auth=true; " + expires + "; path=/";

            router.push("/admin");
            router.refresh(); // Refresh to update middleware state
        } else {
            setError("Неверный пароль");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#FDFCFB]">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-100/40 rounded-full blur-[120px] mix-blend-multiply animate-[pulse_8s_infinite]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px] mix-blend-multiply animate-[pulse_10s_infinite_reverse]" />

            <div className="max-w-md w-full relative z-10 animate-[fadeIn_0.8s_ease-out]">
                {/* Brand Logo - Minimal */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black tracking-tighter text-neutral-900 mb-3 font-serif drop-shadow-sm">
                        амэа
                    </h1>
                    <p className="text-neutral-400 text-xs tracking-[0.3em] uppercase font-bold">
                        Secure Gateway
                    </p>
                </div>

                {/* Login Card - Ultra Glassy */}
                <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] border border-white/60 p-10 md:p-12 relative overflow-hidden group hover:shadow-[0_50px_120px_-30px_rgba(0,0,0,0.12)] transition-shadow duration-500">

                    {/* Subtle Top Shine */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>

                    <form onSubmit={handleLogin} className="space-y-8 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">
                                Ключ доступа
                            </label>

                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <FiLock className={cn(
                                        "w-5 h-5 transition-all duration-300",
                                        error ? "text-red-400" : "text-neutral-300 group-focus-within/input:text-neutral-900"
                                    )} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="••••••••"
                                    className={cn(
                                        "w-full bg-white/50 border border-neutral-200/60 rounded-2xl py-5 pl-14 pr-6 text-xl font-bold tracking-widest outline-none transition-all duration-300",
                                        "placeholder:text-neutral-300 placeholder:font-normal placeholder:tracking-normal",
                                        "focus:bg-white focus:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] focus:border-neutral-300",
                                        error && "border-red-200 bg-red-50/10 focus:border-red-300 focus:ring-4 focus:ring-red-50"
                                    )}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className={cn(
                            "flex items-center justify-center gap-2 text-red-500 text-sm font-medium transition-all duration-300 overflow-hidden",
                            error ? "h-6 opacity-100" : "h-0 opacity-0"
                        )}>
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !password}
                            className={cn(
                                "w-full bg-neutral-900 text-white rounded-2xl py-5 font-bold text-lg transition-all duration-300",
                                "flex items-center justify-center gap-3",
                                "hover:bg-black hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:scale-[1.02]",
                                "active:scale-[0.98]",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                            )}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Войти</span>
                                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-neutral-300 text-[10px] mt-12 tracking-wider font-medium uppercase opacity-60">
                    &copy; 2026 Amea Furniture
                    <span className="mx-2">•</span>
                    Protected Area
                </p>
            </div>
        </div>
    );
}
