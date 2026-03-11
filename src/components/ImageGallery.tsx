"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Share2, Heart, X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-md cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          <img 
            src={images[currentIndex]} 
            alt={`${title} - image ${currentIndex + 1}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-red-50 group transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 flex gap-2">
            <span className="px-4 py-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
              {currentIndex + 1} / {images.length} Ảnh
            </span>
          </div>
          
          <p className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
            Nhấp để phóng to
          </p>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden snap-center transition-all ${
                  currentIndex === idx ? "ring-2 ring-blue-600 ring-offset-2 scale-100 opacity-100" : "opacity-60 hover:opacity-100 scale-95 hover:scale-100"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur flex items-center justify-center animate-in fade-in duration-200">
          <button 
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>

          <button 
            className="absolute left-6 p-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/20 rounded-full transition-colors z-50"
            onClick={prevImage}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img 
            src={images[currentIndex]} 
            alt={`${title} - image ${currentIndex + 1}`} 
            className="max-w-[90vw] max-h-[90vh] object-contain select-none"
          />

          <button 
            className="absolute right-6 p-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/20 rounded-full transition-colors z-50"
            onClick={nextImage}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 font-medium">
             {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
