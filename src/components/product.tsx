"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Smartphone, Laptop, Box, ChevronLeft, ChevronRight } from "lucide-react";

// 1. Define Product Type to fix ESLint "no-explicit-any" error
type Product = {
  id: number;
  name: string;
  tagline: string;
  type: "mobile" | "web" | "btl";
  description: string;
  features: string[];
  webLink: string;
  color: string;
  mockupColor: string;
  video?: string;
  images?: string[];
};

const products: Product[] = [
  {
    id: 1,
    name: "AuditVeda",
    tagline: "Audit Management Simplified",
    type: "mobile",
    description:
      "A comprehensive solution designed to streamline your audit processes. Track compliance, manage checklists, and generate real-time reports directly from your device.",
    features: [
      "Real-time Audit Tracking",
      "Digital Checklists & Evidence",
      "Instant Report Generation",
    ],
    webLink: "https://www.auditveda.com/",
    color: "#00A79D",
    mockupColor: "bg-teal-50",
    video: "/product/auditveda.mp4",
  },
  {
    id: 2,
    name: "PayVeda",
    tagline: "Payroll in Your Pocket",
    type: "web",
    description:
      "Experience seamless payroll and HR management on the web. PayVeda empowers employees and employers with instant access to payslips, leave management, and attendance tracking.",
    features: [
      "View & Download Payslips",
      "Leave & Attendance Management",
      "Tax & Compliance Alerts",
    ],
    webLink: "https://www.payveda.co.in/",
    color: "#002B49",
    mockupColor: "bg-blue-50",
    video: "/product/payveda.mp4",
  },
  {
    id: 3,
    name: "BTL & Field Execution",
    tagline: "Last-Mile Excellence & On-Ground Activation",
    type: "btl",
    description:
      "Comprehensive on-ground activations and brand promotions designed to recreate real-world conditions for last-mile excellence and operational intelligence.",
    features: [
      "On-ground activations & brand promotions",
      "Retail and market audits ",
      "End-to-end field-led & last-mile execution initiatives.",
    ],
    webLink: "#",
    color: "#f59e0b",
    mockupColor: "bg-amber-50",
    images: [
      "/product/btl/image1.jpg",
      "/product/btl/image2.jpg",
      "/product/btl/image3.jpg",
      "/product/btl/image4.jpg",
      "/product/btl/image5.jpg",
    ],
  },
];

const BTLCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      {/* Fix: aspect-[16/9] -> aspect-video */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl border-4 border-white bg-slate-200">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
            alt={`BTL Execution ${currentIndex + 1}`}
          />
        </AnimatePresence>

        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
        >
          <ChevronLeft size={24} className="text-[#002B49]" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
        >
          <ChevronRight size={24} className="text-[#002B49]" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { amount: 0.4 });

  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    />
  );
};

// Fix: specify "product: Product" type instead of "any"
const DeviceFrame = ({ product }: { product: Product }) => {
  if (product.type === "mobile" && product.video) {
    return (
      /* Fix: border-[12px] -> border-12, h-[500px] -> h-125, w-[250px] -> w-62.5 */
      <div className="relative mx-auto border-gray-800 bg-gray-800 border-12 rounded-[2.5rem] h-125 w-62.5 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20" />
        <div className={`w-full h-full relative ${product.mockupColor}`}>
          <ProductVideo src={product.video} />
        </div>
      </div>
    );
  }

  if (product.type === "btl" && product.images) {
    return <BTLCarousel images={product.images} />;
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative rounded-t-xl bg-gray-900 border-x-8 border-t-8 border-gray-800 pt-2 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 pb-2 border-b border-gray-800">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-amber-500/80" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
        </div>
        <div className={`aspect-video w-full relative bg-white ${product.mockupColor}`}>
          {product.video && <ProductVideo src={product.video} />}
        </div>
      </div>
      <div className="relative h-3 w-[104%] -left-[2%] bg-gray-800 rounded-b-xl" />
    </div>
  );
};

export default function Products() {
  return (
    <section id="products" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h3 className="text-sm font-bold tracking-widest text-[#00A79D] uppercase mb-2">
            Our Portfolio
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold text-[#002B49]">
            Tailored Digital & Field Solutions
          </h2>
        </div>

        <div className="flex flex-col gap-32">
          {products.map((product, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12 lg:gap-24`}
              >
                <div className="w-full lg:w-1/2 flex justify-center relative group">
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: product.color }}
                  />
                  <DeviceFrame product={product} />
                </div>

                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                    {product.type === "mobile" && <Smartphone size={14} />}
                    {product.type === "web" && <Laptop size={14} />}
                    {product.type === "btl" && <Box size={14} />}
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      {product.type === "mobile" ? "Mobile App" : product.type === "web" ? "Web Platform" : "On-Ground Execution"}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-[#002B49] mb-4">
                    {product.name}
                  </h3>
                  <p className="text-[#00A79D] font-semibold mb-6">{product.tagline}</p>
                  <p className="text-slate-600 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                    {product.description}
                  </p>

                  <ul className="flex flex-col gap-3 mb-10 max-w-md mx-auto lg:mx-0">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700">
                        <Check size={18} className="text-[#00A79D]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {product.type !== "btl" && (
                    <a
                      href={product.webLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[#002B49] text-white px-8 py-4 rounded-xl hover:bg-[#003d66] transition-all group shadow-lg"
                    >
                      Launch {product.name}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}