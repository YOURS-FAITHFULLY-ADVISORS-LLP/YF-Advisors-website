"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import ReactLenis from "lenis/react";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { servicesData } from "../data/services/data";

// --- Types ---
interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  shortDescription: string;
}

const services: Service[] = servicesData;

// --- Single sticky/stacking card ---
const StickyServiceCard = ({
  i,
  service,
  progress,
  range,
  targetScale,
}: {
  i: number;
  service: Service;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const Icon = service.icon;

  const scale = useTransform(progress, range, [1, targetScale]);
  // fade the card slightly as the next one lands on top of it
  const opacity = useTransform(progress, range, [1, 0.6]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex h-screen items-center justify-center"
    >
      <motion.div
        style={{
          scale,
          opacity,
          top: `calc(-5vh + ${i * 20}px)`,
        }}
        onClick={() => router.push(`/services/${service.id}`)}
        className="group relative -top-1/4 flex h-[420px] w-[min(90vw,560px)] origin-top cursor-pointer flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-2xl"
      >
        {/* Hover / ambient gradient */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${service.color}12 0%, transparent 55%)`,
          }}
        />

        {/* Big background number */}
        <span
          className="pointer-events-none absolute -top-8 -right-4 select-none text-[9rem] font-black leading-none text-slate-50"
          aria-hidden="true"
        >
          {(i + 1).toString().padStart(2, "0")}
        </span>

        <div className="relative z-10 flex h-full flex-col">
          {/* Icon */}
          <div
            className="mb-8 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
            style={{ backgroundColor: service.color + "15" }}
          >
            <Icon size={30} color={service.color} strokeWidth={2} />
          </div>

          {/* Title */}
          <h3 className="mb-4 font-serif text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            {service.title}
          </h3>

          {/* Description */}
          <p className="mb-8 line-clamp-3 max-w-md text-base font-medium leading-relaxed text-slate-500">
            {service.shortDescription}
          </p>

          {/* Read more */}
          <button
            className="mt-auto flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 group-hover:gap-3"
            style={{ color: service.color }}
          >
            Read More
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-0 h-1.5 w-0 transition-all duration-500 group-hover:w-full"
          style={{ backgroundColor: service.color }}
        />
      </motion.div>
    </div>
  );
};

// --- Main export ---
export default function StickyServicesSection() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <ReactLenis root>
      <section id="services" className="relative w-full bg-slate-50">
        <main
          ref={container}
          className="relative flex w-full flex-col items-center justify-center pb-[50vh] pt-[30vh]"
        >
          <div className="sticky top-[8%] z-50 grid w-full content-start justify-items-center gap-6 text-center">
            <h2 className="text-4xl font-black uppercase tracking-widest text-black md:text-6xl">
              Services
            </h2>
            <span className="after:from-slate-400 after:to-transparent relative max-w-[16ch] text-xs uppercase leading-tight tracking-wider text-slate-400 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
              Scroll down to explore
            </span>
          </div>

          {services.map((service, i) => {
            const targetScale = Math.max(0.85, 1 - (services.length - i - 1) * 0.05);
            return (
              <StickyServiceCard
                key={service.id}
                i={i}
                service={service}
                progress={scrollYProgress}
                range={[i * (1 / services.length), 1]}
                targetScale={targetScale}
              />
            );
          })}
        </main>
      </section>
    </ReactLenis>
  );
}