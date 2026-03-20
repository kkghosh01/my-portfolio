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

  return (
    <>
      {/* Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:h-[420px]">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative rounded-xl overflow-hidden group cursor-zoom-in

            ${index === 0 ? "lg:row-span-2 h-[260px] lg:h-full" : "h-[260px]"}

            `}
          >
            <Image
              src={img}
              alt={`${title} ${index}`}
              fill
              priority={index === 0}
              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

            <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <ImageModal
          images={images}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
