"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, PlayCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export interface HeroCMSData {
  id?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string | null;
  heroButtonText?: string | null;
  heroButtonLink?: string | null;
}

const DEFAULT_HERO_DATA: HeroCMSData = {
  id: "homepage",
  heroTitle: "Grow your business not your Back Office",
  heroDescription:
    "Maximize efficiency with customized Global Business Services (GBS). We tailor outsourcing strategies using AI-Driven tech to transform chaos into a competitive advantage",
  heroImage: null,
  heroButtonText: "Connect Now",
  heroButtonLink: "https://wa.me/918080506185",
};

// --- Skeleton Component for Hero (Prevents FOUC) ---
const HeroSkeleton = () => {
  return (
    <section className="relative w-full pt-24 pb-40 md:pt-32 md:pb-48 overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute top-0 left-0 right-0 h-200 opacity-60">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full bg-indigo-200/40 blur-[120px]" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[80%] rounded-full bg-teal-200/40 blur-[120px]" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center animate-pulse">
          {/* Skeleton Title (2 Lines) */}
          <div className="w-full max-w-3xl space-y-4 mb-6">
            <div className="h-12 md:h-16 bg-slate-200 rounded-2xl w-5/6 mx-auto" />
            <div className="h-12 md:h-16 bg-slate-200 rounded-2xl w-4/6 mx-auto" />
          </div>

          {/* Skeleton Description (2 Lines) */}
          <div className="w-full max-w-2xl space-y-3 mb-10">
            <div className="h-5 bg-slate-100 rounded-xl w-full mx-auto" />
            <div className="h-5 bg-slate-100 rounded-xl w-4/5 mx-auto" />
          </div>

          {/* Skeleton Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="h-14 w-48 bg-slate-200 rounded-full" />
            <div className="h-14 w-48 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  const [data, setData] = useState<HeroCMSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCMSData() {
      try {
        const res = await fetch("/api/admin/homepage");
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && json.data) {
            setData(json.data);
            setLoading(false);
            return;
          }
        }
        if (isMounted) {
          setData(DEFAULT_HERO_DATA);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch homepage hero data:", err);
        if (isMounted) {
          setData(DEFAULT_HERO_DATA);
          setHasError(true);
          setLoading(false);
        }
      }
    }
    loadCMSData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Custom handler for smooth scrolling to #services
  const handleScrollToServices = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const servicesSection = document.getElementById("services");

    if (servicesSection) {
      e.preventDefault();
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Show Skeleton while loading (Removes FOUC completely)
  if (loading) {
    return <HeroSkeleton />;
  }

  const currentData = data || DEFAULT_HERO_DATA;
  const title = currentData.heroTitle || DEFAULT_HERO_DATA.heroTitle!;
  const description = currentData.heroDescription || DEFAULT_HERO_DATA.heroDescription!;
  const buttonText = currentData.heroButtonText || DEFAULT_HERO_DATA.heroButtonText!;
  const buttonLink = "https://wa.me/918080506185";
  const heroImage = currentData.heroImage;

  // Ensures headline splits cleanly into 2 lines
  const renderTwoLineTitle = (text: string) => {
    if (!text) return null;

    if (/<br\s*\/?>/i.test(text)) {
      return <span dangerouslySetInnerHTML={{ __html: text }} />;
    }

    const words = text.trim().split(/\s+/);
    if (words.length >= 3) {
      const notIndex = words.findIndex((w) => w.toLowerCase() === "not");
      const splitIndex = notIndex !== -1 ? notIndex + 1 : Math.ceil(words.length / 2);

      const line1 = words.slice(0, splitIndex).join(" ");
      const line2 = words.slice(splitIndex).join(" ");

      return (
        <>
          {line1} <br className="hidden sm:block" />
          {line2}
        </>
      );
    }

    return text;
  };

  return (
    <section className="relative w-full pt-24 pb-40 md:pt-32 md:pb-48 overflow-hidden bg-white">
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]"></div>

        {/* Soft Gradient Mesh */}
        <div className="absolute top-0 left-0 right-0 h-200 opacity-60">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full bg-indigo-200/40 blur-[120px]" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[80%] rounded-full bg-teal-200/40 blur-[120px]" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* --- Headline (Strict 2 Lines) --- */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-[72px] leading-[1.1] font-bold text-slate-900 mb-6 tracking-tight max-w-4xl mx-auto"
          >
            {renderTwoLineTitle(title)}
          </motion.h1>

          {/* --- Subheadline --- */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10 font-medium"
          >
            {description}
          </motion.p>

          {/* --- Buttons --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            {/* Primary Button */}
            <Link
              href={buttonLink}
              target={buttonLink.startsWith("http") ? "_blank" : "_self"}
              rel={buttonLink.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-slate-500/20 w-full sm:w-auto min-w-50"
            >
              <span>{buttonText}</span>
              <div className="bg-white/20 rounded-full p-1 transition-transform group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </div>
            </Link>

            {/* Secondary Button */}
            <Link
              href="/#services"
              onClick={handleScrollToServices}
              className="group flex items-center justify-between gap-3 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-semibold transition-all hover:border-slate-400 hover:shadow-lg w-full sm:w-auto min-w-50"
            >
              <span>Our Services</span>
              <PlayCircle
                size={22}
                className="text-slate-900 group-hover:scale-110 transition-transform"
              />
            </Link>
          </motion.div>

          {/* Optional CMS Hero Image */}
          {heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80"
            >
              <img
                src={heroImage}
                alt="YF Advisors Hero"
                className="w-full h-auto object-cover max-h-[480px]"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;