"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiUploadCloud, FiX, FiLoader, FiCheck } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import imageCompression from 'browser-image-compression';

interface SupabaseUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export default function SupabaseUploader({ images, onChange, maxImages = 5 }: SupabaseUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [progress, setProgress] = useState(0);

    const compressImage = async (file: File) => {
        const options = {
            maxSizeMB: 1,           // Max size 1MB
            maxWidthOrHeight: 1920, // Max dimension 1920px
            useWebWorker: true,
            fileType: "image/jpeg"  // Convert to JPEG for consistency
        };
        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error("Compression error:", error);
            return file; // Fallback to original if compression fails
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        // 1. Compress
        const compressedFile = await compressImage(file);

        // 2. Prepare Path
        const timestamp = Date.now();
        // Force .jpg extension since we convert to jpeg
        const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.jpg`;
        const filePath = `products/${fileName}`;

        console.log("🔄 Uploading:", filePath, "Size:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");

        // 3. Upload to Supabase
        const { error } = await supabase.storage
            .from('product-images')
            .upload(filePath, compressedFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }

        // 4. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            alert(`Максимум ${maxImages} фото`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        setUploading(true);
        setProgress(0);

        const newImages = [...images];
        let successCount = 0;

        try {
            // SEQUENTIAL UPLOAD to prevent network bottleneck
            for (let i = 0; i < filesToUpload.length; i++) {
                const file = filesToUpload[i];
                try {
                    const url = await uploadImage(file);
                    newImages.push(url);
                    successCount++;

                    // Update main state immediately so user sees progress
                    onChange([...newImages]);

                } catch (err) {
                    console.error(`Failed to upload ${file.name}`, err);
                    alert(`Ошибка загрузки ${file.name}`);
                }

                // Update progress bar
                setProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
            }
        } catch (error) {
            console.error("Critical upload error:", error);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                className={`
                    relative border-2 border-dashed rounded-xl transition-all overflow-hidden
                    ${dragOver ? "border-primary-500 bg-primary-50" : "border-neutral-300 bg-neutral-50"}
                    ${uploading ? "opacity-100 pointer-events-none border-primary-500" : "cursor-pointer hover:border-neutral-400"}
                    ${images.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""}
                `}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    disabled={uploading || images.length >= maxImages}
                />

                <div className="p-8 text-center relative z-0">
                    {uploading ? (
                        <div className="flex flex-col items-center justify-center py-2 animate-[fadeIn_0.3s_ease-out]">
                            <div className="relative w-16 h-16 mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        className="text-neutral-200"
                                    />
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        strokeDasharray={175.93} // 2 * PI * 28
                                        strokeDashoffset={175.93 - (175.93 * progress) / 100}
                                        className="text-primary-600 transition-all duration-300 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-700">
                                    {progress}%
                                </div>
                            </div>
                            <p className="font-bold text-neutral-900">Оптимизация и загрузка...</p>
                            <p className="text-xs text-neutral-500 mt-1">Пожалуйста, подождите</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-neutral-200 group-hover:scale-110 transition-transform">
                                <FiUploadCloud className="w-8 h-8 text-neutral-600" />
                            </div>
                            <p className="text-lg font-bold text-neutral-900 mb-1">
                                {images.length >= maxImages
                                    ? "Лимит загрузки достигнут"
                                    : "Нажмите или перетащите фото"
                                }
                            </p>
                            <p className="text-sm text-neutral-500">
                                {images.length >= maxImages
                                    ? `Удалите фото, чтобы загрузить новые (Макс. ${maxImages})`
                                    : `Авто-сжатие до 1MB · Макс. ${maxImages} фото`
                                }
                            </p>
                        </>
                    )}
                </div>

                {/* Progress Bar Background */}
                {uploading && (
                    <div
                        className="absolute bottom-0 left-0 h-1 bg-primary-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                )}
            </div>

            {/* Image Previews - Magazine Layout */}
            {images.length > 0 && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    {/* Main Cover Image (Hero) */}
                    <div className="relative aspect-[4/3] w-full bg-white rounded-2xl overflow-hidden border-2 border-neutral-200 shadow-sm group">
                        <Image
                            src={images[0]}
                            alt="Обложка"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                        <div className="absolute top-4 left-4 bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md z-10">
                            ГЛАВНАЯ ОБЛОЖКА
                        </div>

                        {/* Remove Button for Cover */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => removeImage(0)}
                                className="bg-white text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-50 hover:scale-105 transition-all shadow-lg"
                                type="button"
                            >
                                Удалить фото
                            </button>
                        </div>
                    </div>

                    {/* Additional Images Grid */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.slice(1).map((url, i) => {
                                const realIndex = i + 1;
                                return (
                                    <div
                                        key={url}
                                        className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden group border border-neutral-200 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <Image
                                            src={url}
                                            alt={`Фото ${realIndex + 1}`}
                                            fill
                                            className="object-contain" // Changed to contain as requested
                                            unoptimized
                                        />

                                        {/* Overlay Controls */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                            {/* Move Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newImages = [...images];
                                                        // Swap with previous (index - 1)
                                                        [newImages[realIndex - 1], newImages[realIndex]] = [newImages[realIndex], newImages[realIndex - 1]];
                                                        onChange(newImages);
                                                    }}
                                                    className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-neutral-800 hover:bg-white transition-colors"
                                                    title="Сделать обложкой"
                                                >
                                                    ↑
                                                </button>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(realIndex);
                                                }}
                                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                                                type="button"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
