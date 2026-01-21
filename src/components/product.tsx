"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Smartphone, Star, Globe, ArrowRight } from "lucide-react";
import Image from "next/image";

// --- Product Data ---
const products = [
  {
    id: 1,
    name: "AuditVeda",
    tagline: "Audit Management Simplified",
    description:
      "A comprehensive web solution designed to streamline your audit processes. Track compliance, manage checklists, and generate real-time reports directly from your dashboard—enhancing efficiency and accuracy.",
    features: [
      "Real-time Audit Tracking",
      "Digital Checklists & Evidence",
      "Instant Report Generation",
    ],
    webLink: "https://www.auditveda.com/",
    color: "#00A79D", // Teal
    mockupColor: "bg-teal-50",
    // Changed to video property
    video: "/product/auditveda.mp4",
    // Keep image as fallback/poster if needed, or null if strictly video
    image: "/product/auditveda.png", 
  },
  {
    id: 2,
    name: "PayVeda",
    tagline: "Payroll in Your Pocket",
    description:
      "Experience seamless payroll and HR management on the web. PayVeda empowers employees and employers with instant access to payslips, leave management, and attendance tracking in a secure environment.",
    features: [
      "View & Download Payslips",
      "Leave & Attendance Management",
      "Tax & Compliance Alerts",
    ],
    webLink: "https://www.payveda.co.in/",
    color: "#002B49", // Navy
    mockupColor: "bg-blue-50",
    image: "/product/payveda.png",
  },
];

// --- Sub-Components ---

const WebAppButton = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group"
  >
    <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
      <Globe size={24} className="text-white" />
    </div>
    <div className="flex flex-col items-start leading-none">
      <span className="text-[10px] uppercase font-medium opacity-80 mb-1">
        Access Now
      </span>
      <span className="text-sm font-bold tracking-wide flex items-center gap-1">
        Launch Web App{" "}
        <ArrowRight
          size={14}
          className="group-hover:translate-x-1 transition-transform"
        />
      </span>
    </div>
  </a>
);

// Helper component for Video handling
const ProductVideo = ({ src, poster }: { src: string; poster?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Detect if the video element is in the viewport (0.5 means 50% visible)
  const isInView = useInView(videoRef, { amount: 0.5 });

  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error);
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      className="object-cover w-full h-full absolute inset-0 z-10"
    />
  );
};

const PhoneMockup = ({ product }: { product: (typeof products)[0] }) => {
  return (
    <div className="relative mx-auto border-gray-800 bg-gray-800 border-14 rounded-[2.5rem] h-125 w-70 shadow-2xl flex flex-col justify-center items-center overflow-hidden">
      {/* Notch Buttons */}
      <div className="h-8 w-0.75 bg-gray-800 absolute -start-4.25 top-18 rounded-s-lg"></div>
      <div className="h-11.5 w-0.75 bg-gray-800 absolute -start-4.25 top-31 rounded-s-lg"></div>
      <div className="h-11.5 w-0.75 bg-gray-800 absolute -start-4.25 top-44.5 rounded-s-lg"></div>
      <div className="h-16 w-0.75 bg-gray-800 absolute -end-4.25 top-35.5 rounded-e-lg"></div>

      {/* Screen Content */}
      <div
        className={`rounded-4xl overflow-hidden w-full h-full bg-white relative flex flex-col items-center justify-center ${product.mockupColor}`}
      >
        {/* Conditional Rendering: Video or Image */}
        {product.video ? (
          <ProductVideo src={product.video} poster={product.image} />
        ) : (
          <Image
            src={product.image || ""}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Fallback Overlay (Hidden if content loads) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
          <Smartphone size={48} className="text-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default function Products() {
  return (
    <section
      id="products"
      className="py-24 bg-slate-50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* --- Header --- */}
        <div className="text-center mb-24">
          <h3 className="text-sm font-bold tracking-widest text-[#00A79D] uppercase mb-2">
            Our Products
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold text-[#002B49]">
            Digital Solutions for Modern Business
          </h2>
        </div>

        {/* --- Products List --- */}
        <div className="flex flex-col gap-24 md:gap-32">
          {products.map((product, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12 lg:gap-24`}
              >
                {/* 1. Mobile Mockup Side */}
                <div className="relative group">
                  {/* Decorative Blob behind phone */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                    style={{ backgroundColor: product.color }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: isEven ? -2 : 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <PhoneMockup product={product} />
                  </motion.div>
                </div>

                {/* 2. Content Side */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                    <Star
                      size={14}
                      className="text-amber-400 fill-amber-400"
                    />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Rated 4.8/5
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-[#002B49] mb-4">
                    {product.name}
                  </h3>

                  <p className="text-lg font-medium text-[#00A79D] mb-6">
                    {product.tagline}
                  </p>

                  <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                    {product.description}
                  </p>

                  <ul className="flex flex-col gap-3 mb-10 max-w-md mx-auto lg:mx-0">
                    {product.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-slate-700"
                      >
                        <div className="p-1 rounded-full bg-teal-50 text-[#00A79D]">
                          <Check size={16} strokeWidth={3} />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-center lg:justify-start">
                    <WebAppButton href={product.webLink} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}