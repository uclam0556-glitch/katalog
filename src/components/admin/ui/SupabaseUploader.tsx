"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiUploadCloud, FiX, FiLoader } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

interface SupabaseUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export default function SupabaseUploader({ images, onChange, maxImages = 5 }: SupabaseUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const uploadImage = async (file: File): Promise<string> => {
        // Use only timestamp and extension to avoid any encoding issues
        const timestamp = Date.now();
        const extension = file.name.split('.').pop() || 'jpg';
        const fileName = `${timestamp}.${extension}`;
        const filePath = `products/${fileName}`;

        console.log("🔄 Uploading to Supabase:", filePath);

        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("❌ Upload error:", error);
            throw new Error(`Ошибка загрузки: ${error.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        console.log("✅ Upload complete:", publicUrl);
        return publicUrl;
    };

    const handleFileSelect = async (files: FileList | null) => {
        console.log("📂 Files selected:", files?.length || 0);
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            alert(`Максимум ${maxImages} фото`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        console.log("📤 Uploading files:", filesToUpload.map(f => f.name));
        setUploading(true);

        try {
            const uploadPromises = filesToUpload.map((file) => uploadImage(file));
            const uploadedUrls = await Promise.all(uploadPromises);
            console.log("✅ All uploads complete:", uploadedUrls);
            onChange([...images, ...uploadedUrls]);
        } catch (error: any) {
            console.error("❌ Upload failed:", error);
            alert(`Ошибка загрузки: ${error.message}`);
        } finally {
            setUploading(false);
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
                    relative border-2 border-dashed rounded-xl transition-all
                    ${dragOver ? "border-primary-500 bg-primary-50" : "border-neutral-300 bg-neutral-50"}
                    ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-neutral-400"}
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
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploading || images.length >= maxImages}
                />

                <div className="p-8 text-center">
                    {uploading ? (
                        <div className="flex flex-col items-center text-primary-600">
                            <FiLoader className="w-10 h-10 animate-spin mb-3" />
                            <p className="font-medium">Загрузка...</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-neutral-200">
                                <FiUploadCloud className="w-8 h-8 text-neutral-600" />
                            </div>
                            <p className="text-lg font-medium text-neutral-900 mb-1">
                                {images.length >= maxImages
                                    ? `Загружено максимум (${maxImages} фото)`
                                    : "Перетащите фото или нажмите"
                                }
                            </p>
                            <p className="text-sm text-neutral-500">
                                {images.length >= maxImages
                                    ? "Удалите фото, чтобы добавить новые"
                                    : `JPG, PNG, WEBP до 10MB · Загружено ${images.length}/${maxImages}`
                                }
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {images.map((url, index) => (
                        <div
                            key={url}
                            className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden group border-2 border-neutral-200"
                        >
                            <Image
                                src={url}
                                alt={`Фото ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                            />

                            {/* Main Badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                    ГЛАВНАЯ
                                </div>
                            )}

                            {/* Remove Button */}
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                type="button"
                            >
                                <FiX className="w-4 h-4" />
                            </button>

                            {/* Index Number */}
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
