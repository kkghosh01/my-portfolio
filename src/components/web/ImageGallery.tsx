// components/ImageGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { ImageModal } from "./ImageModal";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const closeModal = () => {
    setSelectedIndex(null);
  };

  return (
    <>
      {/* Mobile: single column, Tablet: 2 columns, Desktop: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative rounded-xl overflow-hidden group cursor-zoom-in ${
              index === 0
                ? "md:col-span-2 lg:col-span-1 aspect-video md:aspect-auto"
                : "aspect-square"
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={img}
              alt={`${title} - Image ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="absolute top-3 right-3 p-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <ImageModal
          images={images}
          title={title}
          initialIndex={selectedIndex}
          onClose={closeModal}
        />
      )}
    </>
  );
}
