"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { 
  motion, 
  useMotionValue, 
  useTransform, 
  type MotionValue, 
  type Transition, 
  type PanInfo,
  Variants
} from "framer-motion";
import {
  Users,
  Lightbulb,
  Target,
  Sparkles,
  Check,
  Globe,
  Shield,
  TrendingUp,
  ArrowUpRight,
  Zap
} from "lucide-react";

// ==========================================
// SHARED DATA
// ==========================================

const FEATURES_DATA = [
  {
    id: 1,
    title: "Who We Are",
    description: "A powerhouse team of 10+ partners and 50+ experts—including CAs, CSs, and legal professionals—serving clients in India, USA and Dubai.",
    icon: <Users className="h-6 w-6 text-white" />,
    colSpan: "md:col-span-2",
    bg: "bg-linear-to-br from-[#002B49] to-[#00406b] text-white",
    iconBg: "bg-white/10",
    iconColor: "text-white"
  },
  {
    id: 2,
    title: "Our Vision",
    points: [
      "Building seamless 'lean' cultures.",
      "Prioritizing absolute client trust.",
      "Providing flexible, 24/7 global support.",
    ],
    icon: <Lightbulb className="h-6 w-6 text-white" />,
    colSpan: "md:col-span-1",
    bg: "bg-white border border-gray-100",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500"
  },
  {
    id: 3,
    title: "Our Mission",
    points: [
      "Turning innovative ideas into reality.",
      "Setting the standard for pro services.",
      "Delivering work teams are proud of.",
    ],
    icon: <Target className="h-6 w-6 text-white" />,
    colSpan: "md:col-span-1",
    bg: "bg-white border border-gray-100",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500"
  },
  {
    id: 4,
    title: "Why Choose Us?",
    description: "We offer a fresh, practical approach to tax planning and financial maintenance. Our solutions are customized, innovative, and cost-effective—designed to make your life simpler.",
    icon: <Sparkles className="h-6 w-6 text-white" />,
    colSpan: "md:col-span-2",
    bg: "bg-linear-to-br from-teal-50 to-white border border-teal-100",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600"
  }
];

const STATS_DATA = [
  { icon: Globe, label: "Global Presence", sub: "India, USA & Dubai" },
  { icon: Shield, label: "Trusted By", sub: "10+ Partners" },
  { icon: TrendingUp, label: "Expert Team", sub: "50+ Professionals" },
];

// ==========================================
// 1. CAROUSEL COMPONENT (Optimized for Mobile)
// ==========================================

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: typeof FEATURES_DATA[0];
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: MotionValue<number>;
  transition: Transition;
}

function CarouselItem({ item, index, itemWidth, trackItemOffset, x, transition }: CarouselItemProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      className={`
        relative shrink-0 flex flex-col justify-start gap-3 p-8
        rounded-3xl shadow-xl shadow-slate-200/50 
        overflow-hidden cursor-grab active:cursor-grabbing will-change-transform
        ${item.bg === "bg-white border border-gray-100" ? "bg-white border border-gray-200" : item.bg}
      `}
      style={{
        width: itemWidth,
        height: '100%',
        rotateY: rotateY,
        perspective: 1000,
      }}
      transition={transition}
    >
      {/* Decorative Blur for Dark Cards */}
      {item.title.includes("Who") && (
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      )}

      {/* Icon Section */}
      <div className={`p-3.5 w-fit rounded-2xl ${item.iconBg} ${item.iconColor} shadow-sm`}>
        {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-7 h-7" })}
      </div>

      {/* Content Section */}
      <div className="w-full">
        <div className={`mb-3 font-bold text-2xl ${item.title.includes("Who") || item.title.includes("Choose") && item.bg.includes("text-white") ? "text-white" : "text-[#002B49]"}`}>
          {item.title}
        </div>
        
        {item.points ? (
          <ul className="space-y-3">
            {item.points.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`mt-1 p-0.5 rounded-full shrink-0 ${item.iconColor.includes("amber") ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"}`}>
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-base text-slate-600 leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`text-base leading-relaxed ${item.bg.includes("text-white") ? "text-blue-50" : "text-slate-600"}`}>
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

const AboutCarousel = () => {
  const items = FEATURES_DATA;
  const baseWidth = 340; 
  const autoplay = true;
  const autoplayDelay = 3500; // Adjusted for better pacing
  const pauseOnHover = true;

  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;
  
  const itemsForRender = useMemo(() => {
    return [items[items.length - 1], ...items, items[0]];
  }, [items]);

  const [position, setPosition] = useState<number>(1);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize position
  useEffect(() => {
    x.set(-1 * trackItemOffset);
  }, [trackItemOffset, x]); 

  // Handle Hover State
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      // Touch events for mobile interaction pausing
      container.addEventListener('touchstart', handleMouseEnter);
      container.addEventListener('touchend', handleMouseLeave);

      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('touchstart', handleMouseEnter);
        container.removeEventListener('touchend', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  // Autoplay Logic - simplified and robust
  useEffect(() => {
    if (!autoplay || isHovered || isJumping) return;

    const timer = setInterval(() => {
      setPosition((prev) => prev + 1);
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, isJumping]);

  const handleAnimationComplete = () => {
    const lastCloneIndex = itemsForRender.length - 1;
    
    // Check if we reached the cloned end (Right side)
    if (position >= lastCloneIndex) {
      setIsJumping(true);
      setPosition(1);
      x.set(-1 * trackItemOffset);
      
      // Use requestAnimationFrame to ensure the jump is invisible before resuming animation
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
    } 
    // Check if we reached the cloned start (Left side)
    else if (position <= 0) {
      setIsJumping(true);
      setPosition(items.length);
      x.set(-items.length * trackItemOffset);
      
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
    } else {
      setIsAnimating(false);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const direction = offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD ? 1 : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD ? -1 : 0;
    
    if (direction !== 0) {
      setPosition(prev => prev + direction);
    }
    // Resume autoplay after drag
    setIsHovered(false);
  };

  const activeIndex = (position - 1 + items.length) % items.length;

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden">
      <div 
        ref={containerRef}
        className="relative p-4"
        style={{ width: `${baseWidth}px`, height: "380px" }} 
      >
        <motion.div
          className="flex h-full"
          drag={isAnimating ? false : 'x'}
          dragConstraints={{ left: -trackItemOffset * itemsForRender.length, right: 0 }}
          style={{
            width: itemWidth,
            gap: `${GAP}px`,
            perspective: 1000,
            perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
            x
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(position * trackItemOffset) }}
          transition={isJumping ? { duration: 0 } : SPRING_OPTIONS}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={handleAnimationComplete}
        >
          {itemsForRender.map((item, index) => (
            <CarouselItem
              key={`${item.id}-${index}`}
              item={item}
              index={index}
              itemWidth={itemWidth}
              trackItemOffset={trackItemOffset}
              x={x}
              transition={isJumping ? { duration: 0 } : SPRING_OPTIONS}
            />
          ))}
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="flex w-full justify-center mt-2">
        <div className="flex gap-2">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-200 ${
                activeIndex === index ? 'bg-[#00A79D]' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              animate={{ scale: activeIndex === index ? 1.2 : 1 }}
              onClick={() => setPosition(index + 1)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>

      {/* Mobile Stats Stack */}
      <div className="flex flex-col gap-4 mt-10 w-full max-w-xs">
        {STATS_DATA.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
              <div className="p-3 rounded-lg bg-[#00A79D]/10 text-[#00A79D]">
                <Icon size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#002B49]">{stat.label}</h4>
                <p className="text-slate-500 text-xs">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 2. GRID COMPONENT (For Desktop)
// ==========================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } },
};

const AboutGrid = () => {
  return (
    <div className="w-full">
      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {FEATURES_DATA.map((feature, index) => {
          const isWide = feature.colSpan?.includes("2");
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              className={`
                relative p-8 md:p-10 rounded-4xl shadow-xl shadow-slate-200/50 
                flex flex-col justify-between overflow-hidden group
                ${feature.bg} ${isWide ? "md:col-span-2" : "md:col-span-1"}
              `}
            >
              {/* Decoration for Dark Card */}
              {feature.title === "Who We Are" && (
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              )}

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3.5 rounded-2xl ${feature.iconBg} ${feature.iconColor} flex items-center justify-center`}>
                    {React.cloneElement(feature.icon as React.ReactElement<{ className?: string }>, { className: `w-6 h-6 ${feature.title.includes("Who") ? "text-white" : "text-current"}` })}
                  </div>
                  
                  {isWide && (
                    <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.title === "Who We Are" ? "text-white/50" : "text-teal-600/50"}`}>
                      <ArrowUpRight size={24} />
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>

                {feature.points ? (
                  <ul className="space-y-4">
                    {feature.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`mt-1 p-0.5 rounded-full ${feature.title === "Our Vision" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"}`}>
                          <Check size={12} strokeWidth={4} />
                        </div>
                        <span className="text-base font-medium opacity-80">{point}</span>
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

      {/* Stats Section Desktop */}
      <div className="mt-20 grid grid-cols-3 gap-6 max-w-5xl mx-auto">
        {STATS_DATA.map((stat, i) => {
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
    </div>
  );
};

// ==========================================
// 3. MAIN COMPONENT (Responsive Switcher)
// ==========================================

export default function AboutUs() {
  return (
    <section id="about" className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      
      {/* --- Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-200 h-200 bg-teal-100/30 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-150 h-150 bg-blue-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- Header (Shared) --- */}
        <div className="text-center mb-16 md:mb-20">
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
        </div>

        {/* --- DESKTOP VIEW (Grid) --- */}
        <div className="hidden lg:block">
          <AboutGrid />
        </div>

        {/* --- MOBILE VIEW (Carousel) --- */}
        <div className="block lg:hidden">
          <AboutCarousel />
        </div>

        {/* --- CTA (Shared) --- */}
        <div className="text-center mt-20">
          <button className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#002B49] text-white font-bold rounded-full overflow-hidden shadow-2xl shadow-blue-900/30 hover:scale-105 active:scale-95 transition-transform">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <Zap size={20} className="fill-amber-400 text-amber-400" />
            <span className="relative z-10">Start Your Journey With Us</span>
          </button>
        </div>

      </div>

      {/* Global CSS for Tailwind v4 compatibility if needed for custom animations */}
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}