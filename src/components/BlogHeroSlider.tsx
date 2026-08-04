"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlogHeroSliderProps {
  images: string[];
  title: string;
  category: string;
  formattedDate: string;
  author: string;
}

export default function BlogHeroSlider({
  images,
  title,
  category,
  formattedDate,
  author,
}: BlogHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback to default image if empty array
  const activeImages =
    images.length > 0
      ? images
      : [
          "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/blog/spark.jpg",
        ];

  // Auto-rotate background images every 4 seconds if multiple images exist
  useEffect(() => {
    if (activeImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeImages.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? activeImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeImages.length);
  };

  return (
    <div className="relative w-full h-[420px] md:h-[520px] bg-slate-900 text-white overflow-hidden group">
      {/* Background Image Carousel / Rotating Slideshow */}
      {activeImages.map((imgUrl, index) => (
        <div
          key={imgUrl + index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          {/* Ambient Blurred Background to fit portrait & landscape gracefully */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={imgUrl}
              alt="Hero Ambient Fill"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center blur-xl scale-110 opacity-40 brightness-75"
            />
          </div>

          {/* Foreground Hero Image - fits both portrait and landscape images uncropped */}
          <div className="relative w-full h-full flex items-center justify-center p-2 md:p-6">
            <Image
              src={imgUrl}
              alt={`${title} hero ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              priority={index === 0}
              className="object-contain object-center drop-shadow-2xl transition-all duration-700"
            />
          </div>
        </div>
      ))}

      {/* Hero Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-900/20 z-10 pointer-events-none" />

      {/* Hero Text Content */}
      <div className="relative z-20 max-w-5xl mx-auto h-full flex flex-col justify-end p-6 md:p-12 pb-16 pointer-events-none">
        <span className="bg-[#00A79D] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full w-fit mb-4 shadow-sm pointer-events-auto">
          {category}
        </span>
        <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-white mb-4 max-w-4xl drop-shadow-md leading-tight pointer-events-auto">
          {title}
        </h1>
        <div className="text-xs md:text-sm text-slate-300 font-medium flex items-center gap-3 pointer-events-auto">
          <span>{formattedDate}</span>
          <span>•</span>
          <span>By {author}</span>
        </div>
      </div>

      {/* Rotating Carousel Controls (only if > 1 image) */}
      {activeImages.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous Hero Image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Next Hero Image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-5 right-6 z-30 flex items-center gap-2 bg-slate-950/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {activeImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? "w-6 h-2 bg-[#00A79D]"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
