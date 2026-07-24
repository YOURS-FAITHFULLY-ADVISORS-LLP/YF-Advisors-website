"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import ReactLenis from "lenis/react";
import { 
  ArrowRight, 
  LucideIcon, 
  UserCheck, 
  Settings, 
  UserMinus, 
  Headphones, 
  FileText, 
  PieChart, 
  TrendingUp, 
  Briefcase, 
  Globe, 
  Shield 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { servicesData } from "../data/services/data";

// --- Icon Resolver Helper ---
function getServiceIcon(iconName?: string): LucideIcon {
  if (!iconName) return Briefcase;
  const name = iconName.toLowerCase();
  if (name.includes("usercheck") || name.includes("manpower")) return UserCheck;
  if (name.includes("setting") || name.includes("process")) return Settings;
  if (name.includes("userminus") || name.includes("attrition")) return UserMinus;
  if (name.includes("headphone") || name.includes("virtual")) return Headphones;
  if (name.includes("file") || name.includes("bookkeeping")) return FileText;
  if (name.includes("chart") || name.includes("cfo") || name.includes("finance")) return PieChart;
  if (name.includes("trending") || name.includes("tax")) return TrendingUp;
  if (name.includes("globe")) return Globe;
  if (name.includes("shield")) return Shield;
  return Briefcase;
}

const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
};

// --- Types ---
interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  shortDescription: string;
  keyValueText?: string;
  capabilities: { title: string; description?: string }[];
}

// --- Skeleton Loader Component ---
const ServicesSkeleton = () => (
  <section id="services" className="relative w-full bg-slate-50 py-20">
    <div className="max-w-5xl mx-auto px-6 text-center space-y-4 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-2xl w-48 mx-auto" />
      <div className="h-4 bg-slate-200 rounded-xl w-32 mx-auto" />
      <div className="mt-12 h-[400px] w-full bg-slate-200/90 rounded-[2.5rem] shadow-xl" />
    </div>
  </section>
);

// --- Single sticky/stacking card ---
const StickyServiceCard = ({
  i,
  totalCards,
  service,
  progress,
  range,
  targetScale,
}: {
  i: number;
  totalCards: number;
  service: Service;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const Icon = service.icon;

  const scale = useTransform(progress, range, [1, targetScale]);

  const isLast = i === totalCards - 1;

  const step = 1 / totalCards;
  const nextCardArrives = (i + 1) * step;
  const nextCardSettles = Math.min(nextCardArrives + step * 0.5, 1);
  const dimOpacity = useTransform(
    progress,
    isLast ? [1, 1] : [nextCardArrives, nextCardSettles],
    [0, 0.35]
  );

  return (
    <div
      ref={container}
      style={{ zIndex: i + 1 }}
      className="sticky top-0 isolate flex h-screen items-center justify-center px-4"
    >
      <motion.div
        style={{ scale }}
        onClick={() => router.push(`/services/${service.id}`)}
        className="group relative flex min-h-[480px] md:min-h-0 md:h-[400px] w-[min(90vw,960px)] origin-center cursor-pointer flex-col md:flex-row overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 md:p-10 shadow-2xl transition-all duration-300 gap-8"
      >
        {/* Big background number */}
        <span
          className="pointer-events-none absolute -top-8 -right-4 z-0 select-none text-[9rem] font-black leading-none text-slate-100/70 transition-colors duration-500 group-hover:text-slate-200/50"
          aria-hidden="true"
        >
          {(i + 1).toString().padStart(2, "0")}
        </span>

        {/* Left Column (Main details) */}
        <div className="relative z-10 flex flex-1 flex-col justify-between min-w-0">
          <div>
            {/* Soft Teal Icon Container */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F7F5] border border-[#00A79D]/15 text-[#00A79D] shadow-xs transition-transform duration-500 group-hover:scale-105">
              <Icon className="h-7 w-7 text-[#00A79D]" />
            </div>

            {/* Title */}
            <h3 className="mt-5 text-3xl font-bold font-serif tracking-tight text-slate-900 md:text-4xl break-words">
              {service.title}
            </h3>

            {/* Description */}
            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-md break-words line-clamp-3">
              {service.shortDescription}
            </p>
          </div>

          {/* Solid Teal Pill Button */}
          <div className="mt-8">
            <span className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#00A79D] group-hover:bg-[#008f85] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md group-hover:shadow-lg">
              <span>READ MORE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Right Column (Core Capabilities & Key Value) */}
        <div className="relative z-10 flex flex-1 flex-col justify-center border-t border-slate-100 pt-6 md:border-t-0 md:border-l md:border-slate-100 md:pt-0 md:pl-10 min-w-0">
          {/* CORE CAPABILITIES */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#00A79D] uppercase mb-4">
              CORE CAPABILITIES
            </h4>

            <ul className="space-y-2.5">
              {service.capabilities.slice(0, 4).map((cap, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 min-w-0">
                  <span className="text-[#00A79D] font-bold text-sm leading-none shrink-0">•</span>
                  <span className="break-words line-clamp-1">{cap.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-slate-100" />

          {/* KEY VALUE */}
          <div className="min-w-0">
            <h4 className="text-xs font-bold tracking-widest text-[#00A79D] uppercase mb-1.5">
              KEY VALUE
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 break-all break-words overflow-hidden">
              {service.keyValueText || service.shortDescription}
            </p>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-1.5 bg-[#00A79D]" />

        {/* Opaque dimming overlay */}
        {!isLast && (
          <motion.div
            style={{ opacity: dimOpacity }}
            className="pointer-events-none absolute inset-0 z-20 bg-slate-900"
          />
        )}
      </motion.div>
    </div>
  );
};

// --- Main export ---
export default function StickyServicesSection() {
  const defaultFormattedServices: Service[] = servicesData.map((s) => ({
    id: s.id,
    title: s.title,
    icon: s.icon,
    color: "#00A79D",
    shortDescription: s.shortDescription,
    keyValueText: `Our ${s.title.toLowerCase()} services can help businesses improve their efficiency by streamlining processes, reducing costs, and boosting overall performance.`,
    capabilities: s.detailedServices || []
  }));

  const [servicesList, setServicesList] = useState<Service[]>(defaultFormattedServices);

  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    let isMounted = true;
    async function loadServicesData() {
      try {
        const res = await fetch("/api/admin/services?status=PUBLISHED");
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
            const formatted: Service[] = json.data.map((item: any) => ({
              id: item.slug || item.id,
              title: item.title,
              icon: getServiceIcon(item.icon),
              color: "#00A79D",
              shortDescription: item.cardDescription || stripHtml(item.description) || "Professional Solution",
              keyValueText: item.keyValue || stripHtml(item.description) || `Our ${item.title.toLowerCase()} services help businesses improve efficiency and reduce operational costs.`,
              capabilities: item.offerings && item.offerings.length > 0 
                ? item.offerings 
                : (item.capabilities && item.capabilities.length > 0 ? item.capabilities : [])
            }));
            setServicesList(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    }
    loadServicesData();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeServices = servicesList.length > 0 ? servicesList : defaultFormattedServices;

  return (
    <ReactLenis root>
      <section id="services" className="relative w-full bg-slate-50">
        <main
          ref={container}
          className="relative flex w-full flex-col items-center justify-center"
        >
          <div className="grid w-full content-start justify-items-center gap-5 py-[1vh] text-center">
            <h2 className="text-4xl font-black uppercase tracking-widest text-black md:text-6xl">
              Services
            </h2>
            <span className="relative max-w-[16ch] text-xs uppercase leading-tight tracking-wider text-slate-400">
              Scroll down
            </span>
          </div>

          {activeServices.map((service, i) => {
            const targetScale = Math.max(0.85, 1 - (activeServices.length - i - 1) * 0.05);
            return (
              <StickyServiceCard
                key={service.id}
                i={i}
                totalCards={activeServices.length}
                service={service}
                progress={scrollYProgress}
                range={[i * (1 / activeServices.length), 1]}
                targetScale={targetScale}
              />
            );
          })}
        </main>
      </section>
    </ReactLenis>
  );
}