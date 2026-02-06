"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiLock } from "react-icons/fi";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate network delay for "weight"
        await new Promise(r => setTimeout(r, 800));

        if (password === "1234") {
            document.cookie = "admin_auth=true; path=/";
            router.push("/admin");
        } else {
            setError("Неверный пароль");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
            <div className="max-w-md w-full animate-[fadeIn_0.8s_ease-out]">

                {/* Brand Logo - Minimal */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black tracking-tight text-neutral-900 mb-2 font-serif">
                        амэа
                    </h1>
                    <p className="text-neutral-400 text-sm tracking-widest uppercase font-medium">
                        Admin Access
                    </p>
                </div>

                {/* Login Card - Glassy */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 p-8 md:p-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 to-transparent"></div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                                Пароль администратора
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <FiLock className={`w-5 h-5 transition-colors ${error ? 'text-red-400' : 'text-neutral-300 group-focus-within/input:text-neutral-900'}`} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="••••••••"
                                    className={`w-full bg-neutral-50/50 border ${error ? 'border-red-200 ring-2 ring-red-50' : 'border-neutral-200 focus:border-neutral-900'} rounded-2xl py-4 pl-12 pr-4 text-lg font-medium outline-none transition-all placeholder:text-neutral-300 focus:bg-white focus:shadow-sm`}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-sm font-medium animate-[fadeIn_0.3s_ease-out] justify-center">
                                <span>•</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full bg-neutral-900 hover:bg-black text-white rounded-2xl py-4 font-medium text-lg transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg hover:shadow-xl shadow-neutral-900/10"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Войти
                                    <FiArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-neutral-300 text-xs mt-8">
                    &copy; 2026 Amea Furniture. All rights reserved.
                </p>
            </div>
        </div>
    );
}
