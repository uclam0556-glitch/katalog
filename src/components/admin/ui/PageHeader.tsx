"use client";

import React from "react";
import Link from "next/link";
import { FiChevronRight, FiHome } from "react-icons/fi";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: Breadcrumb[];
    action?: React.ReactNode;
}

export default function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
    return (
        <div className="mb-6">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-2 text-xs mb-3">
                    <Link
                        href="/admin"
                        className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5"
                    >
                        <FiHome className="w-3.5 h-3.5" />
                        <span>Главная</span>
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            {crumb.href ? (
                                <Link
                                    href={crumb.href}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-gray-900 font-medium">{crumb.label}</span>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    {description && <p className="text-gray-600 mt-2 text-sm">{description}</p>}
                </div>
                {action && <div className="ml-4">{action}</div>}
            </div>
        </div>
    );
}
