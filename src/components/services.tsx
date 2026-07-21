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
  detailedServices: { title: string; description: string }[];
}

const services: Service[] = servicesData;

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

  // The LAST card has no sibling stacking on top of it, so it should never
  // darken — otherwise it sits there permanently grey with unreadable text.
  const isLast = i === totalCards - 1;

  // IMPORTANT: we no longer fade the card's own opacity. Fading opacity on a
  // fully-opaque-background card is exactly what caused the "ghosting" —
  // the card behind shows through a semi-transparent card in front of it.
  // Instead we dim the receding card with an OPAQUE dark overlay layered
  // on top of it. That darkens the card without making it see-through.
  //
  // Previously this used the SAME wide `range` prop ([i/n, 1]) as the scale
  // animation, which meant every card kept accumulating darkness across the
  // ENTIRE rest of the scroll — so a card would already look grey while it
  // was still the front-and-center card, long before anything was actually
  // covering it. Instead, the dim should only ramp up during the short
  // window when the NEXT card is arriving, then hold steady (clamped) once
  // that next card has settled on top of it.
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
      // isolate creates a new stacking context so this card's contents
      // can never visually bleed into (or be bled into by) a sibling card
      style={{ zIndex: i + 1 }}
      className="sticky top-0 isolate flex h-screen items-start justify-center pt-16"  
    >
      <motion.div
        style={{ scale }}
        onClick={() => router.push(`/services/${service.id}`)}
        className="group relative flex h-[480px] w-[min(90vw,560px)] origin-center cursor-pointer flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-2xl transition-all duration-300"
      > 
        {/* Hover / ambient gradient */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${service.color}12 0%, transparent 55%)`,
          }}
        />

        {/* Big background number */}
        <span
          className="pointer-events-none absolute -top-8 -right-4 z-0 select-none text-[9rem] font-black leading-none text-slate-50 transition-colors duration-500 group-hover:text-slate-100/50"
          aria-hidden="true"
        >
          {(i + 1).toString().padStart(2, "0")}
        </span>

        <div className="relative z-10 flex h-full flex-col">
          {/* Icon */}
          <div
            className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
            style={{ backgroundColor: service.color + "15" }}
          >
            <Icon size={30} color={service.color} strokeWidth={2} />
          </div>

          {/* Title */}
          <h3 className="mb-3 font-serif text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            {service.title}
          </h3>

          {/* Description */}
          <p className="mb-4 line-clamp-2 max-w-md text-sm font-medium leading-relaxed text-slate-500">
            {service.shortDescription}
          </p>

          {/* Key Features/Sub-services */}
          <div className="mb-6 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Capabilities</span>
            <div className="grid grid-cols-1 gap-2">
              {service.detailedServices.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: service.color }} />
                  <span className="line-clamp-1">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Read more button */}
          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/services/${service.id}`);
              }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:shadow-lg transform active:scale-95 cursor-pointer"
              style={{ backgroundColor: service.color }}
            >
              Read More
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-0 z-10 h-1.5 w-0 transition-all duration-500 group-hover:w-full"
          style={{ backgroundColor: service.color }}
        />

        {/* Opaque dimming overlay — replaces the old opacity fade.
            This sits ABOVE the card's own content (z-20) and darkens the
            card as the next one is about to land on top of it, WITHOUT
            letting the card behind show through. The last card has no
            successor, so it's excluded entirely — it stays fully white
            with fully readable text the whole time it's in view. */}
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
          className="relative flex w-full flex-col items-center justify-center"
        >
          {/*
            Header is now a normal, in-flow block — NOT sticky, NOT fixed,
            NO z-50. It sits above the first sticky card in the DOM, so it
            scrolls up and away naturally as the user scrolls into the
            cards, and it will never re-pin itself over card content.
          */}
          <div className="grid w-full content-start justify-items-center gap-5 py-[1vh] text-center">
            <h2 className="text-4xl font-black uppercase tracking-widest text-black md:text-6xl">
              Services
            </h2>
            <span className="relative max-w-[16ch] text-xs uppercase leading-tight tracking-wider text-slate-400">
              Scroll down
              
            </span>
          </div>

          {services.map((service, i) => {
            const targetScale = Math.max(0.85, 1 - (services.length - i - 1) * 0.05);
            return (
              <StickyServiceCard
                key={service.id}
                i={i}
                totalCards={services.length}
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