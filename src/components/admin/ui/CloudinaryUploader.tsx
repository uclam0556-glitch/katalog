"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiUploadCloud, FiX, FiLoader } from "react-icons/fi";
import { CldUploadWidget } from 'next-cloudinary';

interface CloudinaryUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export default function CloudinaryUploader({ images, onChange, maxImages = 5 }: CloudinaryUploaderProps) {
    const [uploading, setUploading] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUploadSuccess = (result: any) => {
        if (result.event === 'success') {
            const newUrl = result.info.secure_url;
            console.log("✅ Upload complete:", newUrl);
            onChange([...images, newUrl]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <CldUploadWidget
                uploadPreset="katalog_preset"
                onSuccess={handleUploadSuccess}
                options={{
                    maxFiles: maxImages - images.length,
                    maxFileSize: 10000000, // 10MB
                    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                    folder: 'products',
                }}
            >
                {({ open }) => (
                    <div
                        onClick={() => {
                            if (images.length < maxImages) {
                                open();
                            } else {
                                alert(`Максимум ${maxImages} фото`);
                            }
                        }}
                        className={`
                            relative border-2 border-dashed rounded-xl transition-all
                            ${images.length >= maxImages ? "opacity-50 cursor-not-allowed border-neutral-300 bg-neutral-50" : "cursor-pointer hover:border-neutral-400 border-neutral-300 bg-neutral-50"}
                        `}
                    >
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-neutral-200">
                                <FiUploadCloud className="w-8 h-8 text-neutral-600" />
                            </div>
                            <p className="text-lg font-medium text-neutral-900 mb-1">
                                {images.length >= maxImages
                                    ? `Загружено максимум (${maxImages} фото)`
                                    : "Нажмите для загрузки фото"
                                }
                            </p>
                            <p className="text-sm text-neutral-500">
                                {images.length >= maxImages
                                    ? "Удалите фото, чтобы добавить новые"
                                    : `JPG, PNG, WEBP до 10MB · Загружено ${images.length}/${maxImages}`
                                }
                            </p>
                        </div>
                    </div>
                )}
            </CldUploadWidget>

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
