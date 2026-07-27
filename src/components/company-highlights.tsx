"use client";

import React from "react";
import DomeGallery from "./DomeGallery";

const COMPANY_HIGHLIGHT_IMAGES = [
  {
    src: "/blog/diwali-celebration.jpg",
    alt: "YF Advisors Diwali Celebration"
  },
  {
    src: "/blog/food-and-team-bonding.jpg",
    alt: "Team Outing and Bonding"
  },
  {
    src: "/blog/optimism.jpg",
    alt: "YF Advisors Team Strategy Session"
  },
  {
    src: "/product/btl/image1.jpg",
    alt: "On-Ground BTL Activation Execution"
  },
  {
    src: "/product/btl/image2.jpg",
    alt: "Field Event Campaign Execution"
  },
  {
    src: "/product/btl/image3.jpg",
    alt: "Retail Operations Audit"
  },
  {
    src: "/product/btl/image4.jpg",
    alt: "Field Team Excellence"
  },
  {
    src: "/product/btl/image5.jpg",
    alt: "Brand Activation Drive"
  },
  {
    src: "/blog/bookeeping&account.jpg",
    alt: "Financial & Accounting Team Work"
  },
  {
    src: "/blog/new-year-2022.jpg",
    alt: "Annual Kickoff & Celebrations"
  }
];

export default function CompanyHighlights() {
  return (
    <section id="highlights" className="relative w-full bg-[#001D33] py-16 md:py-24 overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 text-center mb-8 relative z-10">
        <h4 className="text-xs font-bold tracking-widest text-[#00A79D] uppercase mb-2">
          LIFE AT YF ADVISORS
        </h4>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-serif">
          Company Highlights
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-300 max-w-xl mx-auto">
          Drag to explore our interactive 3D 360° dome gallery showcasing team moments, field activations, and company milestones.
        </p>
      </div>

      <div className="relative w-full h-[400px] sm:h-[520px] md:h-[620px] lg:h-[720px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
        <DomeGallery
          images={COMPANY_HIGHLIGHT_IMAGES}
          grayscale={false}
          overlayBlurColor="#001D33"
          minRadius={320}
          openedImageWidth="min(90vw, 360px)"
          openedImageHeight="min(90vw, 360px)"
          imageBorderRadius="18px"
          openedImageBorderRadius="20px"
        />
      </div>
    </section>
  );
}
