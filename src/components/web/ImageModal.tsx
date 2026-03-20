"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageModal({ images, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handlePrev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    reset();
  }, [images.length, reset]);

  const handleNext = useCallback(() => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    reset();
  }, [images.length, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.2, 3));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.2, 1));
    };

    window.addEventListener("keydown", handleKeyDown);
    modalRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, handlePrev, handleNext]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(z + 0.2, 3));
    } else {
      setZoom((z) => Math.max(z - 0.2, 1));
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center outline-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
      tabIndex={-1}
    >
      {/* Stop propagation for clicks inside the content */}
      <div
        className="relative w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
              aria-label="Zoom in"
            >
              <ZoomIn size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom((z) => Math.max(z - 0.2, 1))}
              aria-label="Zoom out"
            >
              <ZoomOut size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={reset}
              aria-label="Reset zoom and position"
            >
              <RotateCcw size={20} />
            </Button>
          </div>

          <div className="text-white bg-black/50 rounded-md px-3 py-1.5 text-sm">
            <span id="image-modal-title">{`${index + 1} / ${images.length}`}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            aria-label="Close image modal"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Image Container */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-transform duration-300",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <Image
            src={images[index]}
            alt={`Image ${index + 1} of ${images.length}`}
            fill
            className="object-contain select-none transition-transform duration-300"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            }}
            priority
          />
        </div>

        {/* Navigation */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </Button>
      </div>
    </div>
  );
}
