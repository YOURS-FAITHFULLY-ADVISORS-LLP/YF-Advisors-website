"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  
  // Custom handler for smooth scrolling
  const handleScrollToServices = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const servicesSection = document.getElementById("services");
    
    // If we are on the homepage and the section exists, scroll to it manually
    if (servicesSection) {
      e.preventDefault(); // Stop Next.js from just updating the URL
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-32 pb-40 md:pt-48 md:pb-48 overflow-hidden bg-white">
      
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
          
          {/* --- Badge --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] text-xs font-bold tracking-widest uppercase text-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Strategic Advisory 2.0
            </span>
          </motion.div>

          {/* --- Headline --- */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-[72px] leading-[1.1] font-bold text-slate-900 mb-6 tracking-tight"
          >
            Grow your business not <br className="hidden md:block" />
            your Back Office
          </motion.h1>

          {/* --- Subheadline --- */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10 font-medium"
          >
            Maximize efficiency with customized Global Business Services (GBS). We tailor outsourcing strategies using AI-Driven tech to transform chaos into a competitive advantage
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
              href="https://wa.me/918080506185" 
              className="group flex items-center justify-between gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-slate-500/20 w-full sm:w-auto min-w-50"
            >
              <span>Connect Now</span>
              <div className="bg-white/20 rounded-full p-1 transition-transform group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </div>
            </Link>

            {/* Secondary Button - FIXED */}
            <Link 
              href="/#services"
              onClick={handleScrollToServices}
              className="group flex items-center justify-between gap-3 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-semibold transition-all hover:border-slate-400 hover:shadow-lg w-full sm:w-auto min-w-50"
            >
              <span>Our Services</span>
              <PlayCircle size={22} className="text-slate-900 group-hover:scale-110 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;