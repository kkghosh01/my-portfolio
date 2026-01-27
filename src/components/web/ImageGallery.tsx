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

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  // Mobile Layout
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return (
      <>
        <div className="space-y-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              className="relative w-full aspect-video rounded-xl overflow-hidden group cursor-zoom-in"
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
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

  // Tablet Layout (2-3 images)
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return (
      <>
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              className={`relative rounded-xl overflow-hidden group cursor-zoom-in ${
                index === 0 ? "col-span-2 aspect-video" : "aspect-square"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img}
                alt={`${title} - Image ${index + 1}`}
                fill
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

  // Desktop Layout (Collage)
  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-3 h-125 rounded-2xl overflow-hidden shadow-2xl">
        {images[0] && (
          <button
            onClick={() => handleImageClick(0)}
            className="relative col-span-2 row-span-2 group cursor-zoom-in"
            aria-label="View main image"
          >
            <Image
              src={images[0]}
              alt={`${title} - Main Image`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-5 h-5 text-white" />
            </div>
          </button>
        )}

        {images.slice(1, 3).map((img, index) => (
          <button
            key={index + 1}
            onClick={() => handleImageClick(index + 1)}
            className="relative group cursor-zoom-in"
            aria-label={`View image ${index + 2}`}
          >
            <Image
              src={img}
              alt={`${title} - Image ${index + 2}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}

        {images[3] && (
          <button
            onClick={() => handleImageClick(3)}
            className="relative col-span-2 group cursor-zoom-in"
            aria-label={`View image 4`}
          >
            <Image
              src={images[3]}
              alt={`${title} - Image 4`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 4 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.slice(4).map((img, index) => (
            <button
              key={index + 4}
              onClick={() => handleImageClick(index + 4)}
              className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden group cursor-zoom-in"
              aria-label={`View image ${index + 5}`}
            >
              <Image
                src={img}
                alt={`${title} - Thumbnail ${index + 5}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform"
                sizes="80px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      )}

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
