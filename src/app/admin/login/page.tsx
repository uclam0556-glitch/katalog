"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
    const [pin, setPin] = React.useState("");
    const [error, setError] = React.useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Auth - Simple PIN
        if (pin === "1234") {
            document.cookie = "admin_auth=true; path=/";
            router.push("/admin");
        } else {
            setError("Неверный PIN");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-neutral-100">
                <div className="text-center mb-8">
                    <span className="text-2xl font-serif font-bold text-neutral-900">амэа.</span>
                    <p className="text-sm text-neutral-400 mt-2">Вход для администратора</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Введите PIN код"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-center text-lg tracking-widest"
                            maxLength={4}
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

                    <Button
                        variant="primary"
                        className="w-full h-12 rounded-xl text-base"
                    >
                        Войти
                    </Button>
                </form>
            </div>
        </div>
    );
}
