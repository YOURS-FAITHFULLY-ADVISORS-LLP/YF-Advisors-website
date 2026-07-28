"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  PlayCircle,
  FileText,
  ShieldCheck,
  Users,
  Building2,
  BookOpen,
  Percent,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";

export interface HeroCMSData {
  id?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string | null;
  heroButtonText?: string | null;
  heroButtonLink?: string | null;
  heroCards?: string | null;
}

export interface FeatureCardItem {
  id: string;
  title: string;
  subtitle: string;
}

export const DEFAULT_FEATURE_CARDS: FeatureCardItem[] = [
  { id: 'gst', title: 'GST Filing', subtitle: 'Compliant & On Time' },
  { id: 'compliance', title: 'Compliance', subtitle: 'Stay 100% Compliant' },
  { id: 'payroll', title: 'Payroll', subtitle: 'Accurate & Timely' },
  { id: 'roc', title: 'ROC Filing', subtitle: 'Hassle Free' },
  { id: 'bookkeeping', title: 'Bookkeeping', subtitle: 'Organized & Clean' },
  { id: 'cfo', title: 'Virtual CFO', subtitle: 'Insightful & Strategic' },
  { id: 'tax', title: 'Tax Filing', subtitle: 'Maximize Savings' },
];

const DEFAULT_HERO_DATA: HeroCMSData = {
  id: "homepage",
  heroTitle: "Grow your business, not your Back Office.",
  heroDescription:
    "We deliver smart, reliable and technology-driven business solutions so you can focus on what matters most – growing your business.",
  heroImage: null,
  heroButtonText: "Connect Now",
  heroButtonLink: "https://wa.me/918080506185",
};

export default function Hero({ initialData }: { initialData?: HeroCMSData | null }) {
  const [data, setData] = useState<HeroCMSData | null>(initialData || DEFAULT_HERO_DATA);
  const lenis = useLenis();

  useEffect(() => {
    let isMounted = true;
    async function loadCMSData() {
      try {
        const res = await fetch("/api/admin/homepage", { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && json.data) {
            setData(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch homepage hero data:", err);
      }
    }
    loadCMSData();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentData = data || DEFAULT_HERO_DATA;
  const description = currentData.heroDescription || DEFAULT_HERO_DATA.heroDescription!;
  const buttonText = currentData.heroButtonText || DEFAULT_HERO_DATA.heroButtonText!;
  const buttonLink = currentData.heroButtonLink || "https://wa.me/918080506185";

  let featureCardsList: FeatureCardItem[] = DEFAULT_FEATURE_CARDS;
  if (currentData.heroCards) {
    try {
      const json = JSON.parse(currentData.heroCards);
      if (Array.isArray(json) && json.length > 0) {
        featureCardsList = json;
      }
    } catch (e) {}
  }

  const getCard = (id: string, defaultTitle: string, defaultSub: string) => {
    const found = featureCardsList.find((c) => c.id === id);
    return {
      title: found?.title || defaultTitle,
      subtitle: found?.subtitle || defaultSub,
    };
  };

  const gstCard = getCard('gst', 'GST Filing', 'Compliant & On Time');
  const complianceCard = getCard('compliance', 'Compliance', 'Stay 100% Compliant');
  const payrollCard = getCard('payroll', 'Payroll', 'Accurate & Timely');
  const rocCard = getCard('roc', 'ROC Filing', 'Hassle Free');
  const bookkeepingCard = getCard('bookkeeping', 'Bookkeeping', 'Organized & Clean');
  const cfoCard = getCard('cfo', 'Virtual CFO', 'Insightful & Strategic');
  const taxCard = getCard('tax', 'Tax Filing', 'Maximize Savings');

  // Smooth scroll handler for #services section using Lenis
  const handleScrollToServices = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo("#services", { offset: -60, duration: 1.2 });
    } else {
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Ultra-slim hairline paths with smooth curved elbow bends
  const slimConnections = [
    { id: "gst", path: "M 210 200 L 140 100 Q 120 70 85 45", endDot: { x: 85, y: 45 }, startDot: { x: 210, y: 200 }, dur: 2.8 },
    { id: "compliance", path: "M 290 200 L 360 100 Q 380 70 415 45", endDot: { x: 415, y: 45 }, startDot: { x: 290, y: 200 }, dur: 3.2 },
    { id: "payroll", path: "M 190 250 L 110 230 Q 80 215 45 200", endDot: { x: 45, y: 200 }, startDot: { x: 190, y: 250 }, dur: 3.0 },
    { id: "roc", path: "M 310 250 L 390 230 Q 420 215 455 200", endDot: { x: 455, y: 200 }, startDot: { x: 310, y: 250 }, dur: 2.6 },
    { id: "bookkeeping", path: "M 200 300 L 130 360 Q 100 385 75 415", endDot: { x: 75, y: 415 }, startDot: { x: 200, y: 300 }, dur: 3.4 },
    { id: "cfo", path: "M 300 300 L 370 360 Q 400 385 425 415", endDot: { x: 425, y: 415 }, startDot: { x: 300, y: 300 }, dur: 3.1 },
    { id: "tax", path: "M 250 330 L 250 460", endDot: { x: 250, y: 460 }, startDot: { x: 250, y: 330 }, dur: 2.5 },
  ];

  return (
    <section className="relative w-full pt-24 pb-16 lg:pt-28 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00a79d0a_1px,transparent_1px),linear-gradient(to_bottom,#00a79d0a_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN: TYPOGRAPHY & CTA (Lifted Up) ================= */}
          <div className="lg:col-span-6 space-y-6 text-left -mt-4 lg:-mt-10">
            {/* Eyebrow Tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-[#00A79D] uppercase"
            >
              <span className="w-6 h-[2px] bg-[#00A79D] rounded-full" />
              <span>OUR EXPERTISE. YOUR GROWTH</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[58px] leading-[1.12] font-serif font-extrabold text-[#0F172A] tracking-tight"
            >
              Grow your business, <br />
              not your{" "}
              <span className="text-[#00A79D] font-serif italic relative inline-block">
                Back Office.
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#00A79D]/30"
                  viewBox="0 0 200 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 7C50 2.5 150 2.5 198 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Paragraph Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium pt-1"
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              {/* Connect Now Button */}
              <Link
                href={buttonLink}
                target={buttonLink.startsWith("http") ? "_blank" : "_self"}
                rel={buttonLink.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center justify-center gap-3 bg-[#0F172A] hover:bg-[#1E293B] text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-slate-900/15 transition-all hover:scale-105 active:scale-95"
              >
                <span>{buttonText}</span>
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </div>
              </Link>

              {/* Our Services Button */}
              <Link
                href="/#services"
                onClick={handleScrollToServices}
                className="group inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-7 py-3.5 rounded-full font-bold text-sm shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <span>Our Services</span>
                <PlayCircle className="w-4 h-4 text-slate-700 group-hover:scale-110 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* ================= RIGHT COLUMN: ISOMETRIC ECOSYSTEM ORBIT (Shifted Down) ================= */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[480px] sm:min-h-[560px] mt-8 sm:mt-12 lg:mt-16">
            {/* Concentric Orbiting Rings */}
            <div className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] border border-dashed border-teal-300/60 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />
            <div className="absolute w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] border border-dashed border-teal-200/50 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

            {/* ================= SVG ULTRA-SLIM HAIRLINE CONNECTION LINES & MOVING FLOW BEAMS ================= */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-15 hidden sm:block overflow-visible"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {slimConnections.map((c) => (
                <g key={c.id}>
                  {/* 1. Base Ultra-Slim Hairline Path */}
                  <path
                    d={c.path}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                    fill="none"
                  />

                  {/* 2. Traveling Glowing Flow Segment Beam */}
                  <motion.path
                    d={c.path}
                    stroke="#00A79D"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="30 200"
                    animate={{ strokeDashoffset: [0, -230] }}
                    transition={{
                      duration: c.dur,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* 3. Small Crisp Connection Node Dots */}
                  <circle cx={c.startDot.x} cy={c.startDot.y} r="2.5" fill="#00A79D" />
                  <circle cx={c.endDot.x} cy={c.endDot.y} r="2.5" fill="#00A79D" />
                </g>
              ))}
            </svg>

            {/* Center Premium 3D Isometric Ecosystem Illustration (Floating, Non-Draggable) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.8 },
                scale: { duration: 0.8 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative w-72 h-72 sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-tr from-teal-50/80 via-white to-blue-50/80 border border-teal-100/80 shadow-2xl flex items-center justify-center z-10 overflow-hidden group select-none pointer-events-auto"
            >
              {/* 3D Ecosystem Render Image (Non-Draggable) */}
              <img
                src="/hero-3d-ecosystem.png"
                alt="YF Advisors 3D Business Ecosystem"
                draggable={false}
                className="w-full h-full object-contain pointer-events-none select-none p-2 transform group-hover:scale-105 transition-transform duration-700"
              />

             
            </motion.div>

            {/* ================= 7 ORBITING FLOATING FEATURE CARDS ================= */}

            {/* 1. GST Filing (Top Left) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 left-0 sm:left-4 z-20"
            >
              <div className="relative group bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-xl border border-slate-100 flex items-center gap-2.5 hover:scale-105 transition-all select-none">
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00A79D] border-2 border-white shadow-sm" />
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#00A79D] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{gstCard.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{gstCard.subtitle}</p>
                </div>
              </div>
            </motion.div>

            {/* 2. Compliance (Top Right) */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 right-0 sm:right-4 z-20"
            >
              <div className="relative group bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-xl border border-slate-100 flex items-center gap-2.5 hover:scale-105 transition-all select-none">
                <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{complianceCard.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{complianceCard.subtitle}</p>
                </div>
              </div>
            </motion.div>

            {/* 3. Payroll (Mid Left) */}
            <motion.div
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 -left-4 sm:-left-6 z-20"
            >
              <div className="relative group bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-xl border border-slate-100 flex items-center gap-2.5 hover:scale-105 transition-all select-none">
                <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white shadow-sm" />
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{payrollCard.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{payrollCard.subtitle}</p>
                </div>
              </div>
            </motion.div>

            {/* 4. ROC Filing (Mid Right) */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 -right-4 sm:-right-6 z-20"
            >
              <div className="relative group bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-xl border border-slate-100 flex items-center gap-2.5 hover:scale-105 transition-all select-none">
                <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-600 border-2 border-white shadow-sm" />
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{rocCard.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{rocCard.subtitle}</p>
                </div>
              </div>
            </motion.div>

            {/* 5. Bookkeeping (Lower Left) */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 -left-2 sm:left-2 z-20"
            >
              <div className="relative group bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-xl border border-slate-100 flex items-center gap-2.5 hover:scale-105 transition-all select-none">
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-600 border-2 border-white shadow-sm" />
                <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{bookkeepingCard.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{bookkeepingCard.subtitle}</p>
                </div>
              </div>
            </motion.div>

            {/* 6. Virtual CFO (Lower Right) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 -right-2 sm:right-2 z-20"
            >
              <div className="relative group bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-xl border border-slate-100 flex items-center gap-2.5 hover:scale-105 transition-all select-none">
                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white shadow-sm" />
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{cfoCard.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{cfoCard.subtitle}</p>
                </div>
              </div>
            </motion.div>

            {/* 7. Tax Filing (Bottom Center) */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 z-20"
            >
              <div className="relative group bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl border border-slate-100 flex items-center gap-2.5 hover:scale-105 transition-all select-none">
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-600 border-2 border-white shadow-sm" />
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{taxCard.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{taxCard.subtitle}</p>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}