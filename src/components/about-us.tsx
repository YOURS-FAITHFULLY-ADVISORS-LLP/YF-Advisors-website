"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Target,
  Lightbulb,
  Globe,
  Users,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Check,
  ArrowUpRight,
} from "lucide-react";

// --- Animation Variants ---
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

// --- Data ---
const features = [
  {
    title: "Who We Are",
    description:
      "A powerhouse team of 10+ partners and 50+ experts—including Chartered Accountants, Company Secretaries, and Legal Advocates—delivering excellence from India and Dubai.",
    icon: Users,
    colSpan: "md:col-span-2",
    type: "text",
    bg: "bg-linear-to-br from-[#002B49] to-[#00406b] text-white", // Dark Navy Gradient
    iconColor: "text-white",
    iconBg: "bg-white/10",
  },
  {
    title: "Our Vision",
    points: [
      "Building seamless 'lean' cultures.",
      "Prioritizing absolute client trust.",
      "Providing flexible, 24/7 global support.",
    ],
    icon: Lightbulb,
    colSpan: "md:col-span-1",
    type: "list",
    bg: "bg-white border border-gray-100",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    title: "Our Mission",
    points: [
      "Turning innovative ideas into reality.",
      "Setting the standard for pro services.",
      "Delivering work teams are proud of.",
    ],
    icon: Target,
    colSpan: "md:col-span-1",
    type: "list",
    bg: "bg-white border border-gray-100",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
  {
    title: "Why Choose Us?",
    description:
      "We offer a fresh, practical approach to tax planning and financial maintenance. Our solutions are customized, innovative, and cost-effective—designed to make your life simpler.",
    icon: Sparkles,
    colSpan: "md:col-span-2",
    type: "text",
    bg: "bg-linear-to-br from-teal-50 to-white border border-teal-100",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-100",
  },
];

const stats = [
  { icon: Globe, label: "Global Presence", sub: "India & Dubai" },
  { icon: Shield, label: "Trusted By", sub: "10+ Partners" },
  { icon: TrendingUp, label: "Expert Team", sub: "50+ Professionals" },
];

export default function AboutUs() {
  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      
      {/* --- Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-200 h-200 bg-teal-100/30 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-150 h-150 bg-blue-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-teal-100 shadow-sm text-teal-700 mb-6">
            <Sparkles size={14} className="fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest">
              About YF Advisors
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-[#002B49] mb-6 tracking-tight">
            15+ Years of{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 to-blue-600">
              Trusted Excellence
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Strategic financial partners helping businesses grow with clarity, compliance, and confidence.
          </p>
        </motion.div>

        {/* --- Masonry Grid --- */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isWide = feature.colSpan?.includes("2");

            return (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -8, scale: 1.01 }}
                className={`
                  relative p-8 md:p-10 rounded-4xl shadow-xl shadow-slate-200/50 
                  flex flex-col justify-between overflow-hidden group
                  ${feature.bg} ${isWide ? "md:col-span-2" : ""}
                `}
              >
                {/* Decoration for Dark Card */}
                {feature.title === "Who We Are" && (
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl ${feature.iconBg} ${feature.iconColor}`}>
                      <Icon size={28} />
                    </div>
                    {/* Subtle Corner Icon */}
                    {isWide && (
                      <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.title === "Who We Are" ? "text-white/50" : "text-teal-600/50"}`}>
                        <ArrowUpRight size={24} />
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>

                  {/* Content Logic */}
                  {feature.type === "list" ? (
                    <ul className="space-y-4">
                      {feature.points?.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className={`mt-1 p-0.5 rounded-full ${feature.title === "Our Vision" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"}`}>
                            <Check size={12} strokeWidth={4} />
                          </div>
                          <span className="text-sm md:text-base font-medium opacity-80">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`text-base md:text-lg leading-relaxed ${feature.title === "Who We Are" ? "text-blue-50" : "text-slate-600"}`}>
                      {feature.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* --- Stats Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-200/40"
                >
                  <div className="p-4 rounded-xl bg-linear-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#002B49]">{stat.label}</h4>
                    <p className="text-slate-500 font-medium text-sm">{stat.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* --- CTA --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#002B49] text-white font-bold rounded-full overflow-hidden shadow-2xl shadow-blue-900/30"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            
            <Zap size={20} className="fill-amber-400 text-amber-400" />
            <span className="relative z-10">Start Your Journey With Us</span>
          </motion.button>
        </motion.div>

      </div>

      {/* Tailwind Animation for Shimmer */}
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}