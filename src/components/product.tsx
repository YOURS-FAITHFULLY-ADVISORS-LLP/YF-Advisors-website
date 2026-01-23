"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Star, Globe, ArrowRight, Laptop } from "lucide-react";

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
    color: "#00A79D",
    mockupColor: "bg-teal-50",
    video: "/product/auditveda.mp4",
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
    color: "#002B49",
    mockupColor: "bg-blue-50",
    video: "/product/payveda.mp4",
  },
];

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

const ProductVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { amount: 0.3 });

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

const WebMockup = ({ product }: { product: (typeof products)[0] }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Browser/Laptop Frame */}
      <div className="relative rounded-t-xl bg-gray-900 border-x-8 border-t-8 border-gray-800 pt-2 shadow-2xl overflow-hidden">
        {/* Browser Top Bar */}
        <div className="flex items-center gap-1.5 px-4 pb-2 border-b border-gray-800">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <div className="ml-4 flex-1 h-4 bg-gray-800 rounded-md max-w-40" />
        </div>
        
        {/* Screen Content */}
        <div className={`aspect-video w-full relative overflow-hidden bg-white ${product.mockupColor}`}>
          {product.video ? (
            <ProductVideo src={product.video} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Laptop size={64} className="text-gray-200" />
            </div>
          )}
        </div>
      </div>
      
      {/* Laptop Base */}
      <div className="relative h-3 w-[105%] -left-[2.5%] bg-gray-800 rounded-b-xl shadow-xl" />
      <div className="relative h-1 w-1/4 mx-auto bg-gray-700 rounded-b-xl" />
    </div>
  );
};

export default function Products() {
  return (
    <section id="products" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <h3 className="text-sm font-bold tracking-widest text-[#00A79D] uppercase mb-2">
            Our Products
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold text-[#002B49]">
            Digital Solutions for Modern Business
          </h2>
        </div>

        <div className="flex flex-col gap-24 md:gap-40">
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
                } items-center gap-12 lg:gap-20`}
              >
                {/* Visual Side */}
                <div className="w-full lg:w-1/2 relative group">
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square max-w-sm rounded-full blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                    style={{ backgroundColor: product.color }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <WebMockup product={product} />
                  </motion.div>
                </div>

                {/* Text Side */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Top Rated Solution
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
                      <li key={i} className="flex items-center gap-3 text-slate-700">
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