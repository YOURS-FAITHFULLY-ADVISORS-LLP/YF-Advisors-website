"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight, Smartphone, Laptop } from "lucide-react";

const products = [
  {
    id: 1,
    name: "AuditVeda",
    tagline: "Audit Management Simplified",
    type: "mobile", // Triggers Phone Frame
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
    type: "web", // Triggers Laptop Frame
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
];

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

const DeviceFrame = ({ product }: { product: (typeof products)[0] }) => {
  if (product.type === "mobile") {
    return (
      <div className="relative mx-auto border-gray-800 bg-gray-800 border-12 rounded-[2.5rem] h-125 w-62.5 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20" />
        <div className={`w-full h-full relative ${product.mockupColor}`}>
          <ProductVideo src={product.video} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative rounded-t-xl bg-gray-900 border-x-8 border-t-8p border-gray-800 pt-2 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 pb-2 border-b border-gray-800">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-amber-500/80" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
        </div>
        <div className={`aspect-video w-full relative bg-white ${product.mockupColor}`}>
          <ProductVideo src={product.video} />
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
            Tailored Digital Solutions
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
                    {product.type === "mobile" ? <Smartphone size={14} /> : <Laptop size={14} />}
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      {product.type === "mobile" ? "Mobile App" : "Web Platform"}
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

                  <a
                    href={product.webLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#002B49] text-white px-8 py-4 rounded-xl hover:bg-[#003d66] transition-all group shadow-lg"
                  >
                    Launch {product.name}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}