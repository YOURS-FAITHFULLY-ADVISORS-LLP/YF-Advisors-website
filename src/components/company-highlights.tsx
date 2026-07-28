"use client";

import React, { useState, useEffect } from "react";
import DomeGallery from "./DomeGallery";

const DEFAULT_HIGHLIGHT_IMAGES = [
  {
    src: "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/blog/diwali-celebration.jpg",
    alt: "YF Advisors Diwali Celebration"
  },
  {
    src: "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/blog/food-and-team-bonding.jpg",
    alt: "Team Outing and Bonding"
  },
  {
    src: "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/blog/optimism.jpg",
    alt: "YF Advisors Team Strategy Session"
  },
  {
    src: "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/product/btl/image1.jpg",
    alt: "On-Ground BTL Activation Execution"
  },
  {
    src: "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/product/btl/image2.jpg",
    alt: "Field Event Campaign Execution"
  },
  {
    src: "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/product/btl/image3.jpg",
    alt: "Retail Operations Audit"
  },
  {
    src: "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/product/btl/image4.jpg",
    alt: "Field Team Excellence"
  },
  {
    src: "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/product/btl/image5.jpg",
    alt: "Brand Activation Drive"
  },
  {
    src: "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/blog/bookeeping&account.jpg",
    alt: "Financial & Accounting Team Work"
  },
  {
    src: "https://nhkdhwochgfimbimomst.supabase.co/storage/v1/object/public/uploads/blog/new-year-2022.jpg",
    alt: "Annual Kickoff & Celebrations"
  }
];

export default function CompanyHighlights() {
  const [images, setImages] = useState(DEFAULT_HIGHLIGHT_IMAGES);

  useEffect(() => {
    async function loadHighlights() {
      try {
        const res = await fetch('/api/admin/highlights');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setImages(data.data.map((item: any) => ({
            src: item.src,
            alt: item.alt || item.title || 'YF Advisors Highlight'
          })));
        }
      } catch (err) {
        console.error('Failed to load dynamic highlights:', err);
      }
    }
    loadHighlights();
  }, []);

  return (
    <section id="highlights" className="relative w-full bg-gradient-to-b from-white via-slate-50 to-white py-16 md:py-24 overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 text-center mb-8 relative z-10">
        <span className="inline-block py-1 px-3 rounded-full bg-teal-50 text-[#00A79D] text-xs font-bold tracking-widest uppercase mb-3 border border-teal-100/60">
          LIFE AT YF ADVISORS
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-serif">
          Company Highlights
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-600 max-w-xl mx-auto">
          Drag to explore our interactive 3D 360° dome gallery showcasing team moments, field activations, and company milestones.
        </p>
      </div>

      <div className="relative w-full h-[400px] sm:h-[520px] md:h-[620px] lg:h-[720px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
        <DomeGallery
          images={images}
          fit={0.85}
          fitBasis="width"
          minRadius={600}
          segments={35}
          grayscale={false}
          overlayBlurColor="#FFFFFF"
          openedImageWidth="min(85vw, 300px)"
          openedImageHeight="min(85vw, 380px)"
          imageBorderRadius="16px"
          openedImageBorderRadius="20px"
        />
      </div>
    </section>
  );
}
