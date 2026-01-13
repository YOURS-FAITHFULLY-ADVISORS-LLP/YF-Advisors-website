"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, ShieldCheck, PlayCircle } from "lucide-react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useMotionValue, 
  useSpring, 
  useMotionTemplate 
} from "framer-motion";

// --- 3D Tilt Hook for Image ---
const useTiltEffect = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  return { handleMouseMove, handleMouseLeave, rotateX, rotateY, style: { rotateX, rotateY } };
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]); // Parallax text
  const y2 = useTransform(scrollY, [0, 500], [0, -50]); // Parallax image

  // 3D Tilt Logic
  const tilt = useTiltEffect();

  return (
    <section 
      id="home" 
      className="relative w-full pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden bg-slate-50 perspective-1000"
    >
      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-size-[40px_40px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-120 h-120 bg-teal-500/10 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-100 h-100 bg-blue-600/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* --- Left Column: Content --- */}
          <motion.div 
            style={{ y: y1 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none"
          >
            {/* Animated Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center lg:justify-start mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-slate-600 text-xs font-bold tracking-widest uppercase shadow-sm backdrop-blur-md hover:scale-105 transition-transform cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                </span>
                Strategic Advisory 2.0
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-[72px] leading-[1.1] font-extrabold text-slate-900 mb-8 tracking-tight">
              Grow Your Business <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 via-teal-600 to-blue-700">
                Not Your Back Office
              </span>
            </h1>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 font-medium">
              Maximize efficiency with customized Global Business Services (GBS). 
              We tailor outsourcing strategies using AI-driven tech to transform chaos into a competitive advantage.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <Link 
                href="/contact"
                className="group relative w-full sm:w-auto min-w-40 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold shadow-lg hover:shadow-teal-500/25 hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent z-0"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Connect Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link 
                href="/services"
                className="group flex items-center justify-center gap-3 w-full sm:w-auto min-w-40 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:border-teal-500 hover:text-teal-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                <span>See How It Works</span>
              </Link>
            </div>

            {/* Metrics */}
            <div className="mt-12 pt-8 border-t border-slate-200/60 flex items-center justify-center lg:justify-start gap-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-slate-900">500+</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Clients Served</span>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-slate-900">$2B+</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Revenue Optimized</span>
              </div>
            </div>
          </motion.div>

          {/* --- Right Column: Interactive 3D Visual (Hidden on Mobile) --- */}
          <motion.div 
            style={{ y: y2 }}
            className="hidden lg:block flex-1 relative w-full lg:h-auto z-20 perspective-1000"
          >
            <motion.div
              onMouseMove={tilt.handleMouseMove}
              onMouseLeave={tilt.handleMouseLeave}
              style={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full aspect-[4/3] lg:aspect-square flex items-center justify-center"
            >
              <div className="absolute inset-4 bg-linear-to-tr from-teal-500/30 to-blue-600/30 rounded-[3rem] blur-3xl -z-10 translate-z-[-50px]"></div>

              <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/50 shadow-2xl bg-white transform-gpu translate-z-[20px]">
                 <Image 
                  src="/hero/hero.png" 
                  alt="Strategic Business Meeting"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent pointer-events-none"></div>
              </div>

              {/* Floating Card 1 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 bottom-20 z-30 translate-z-[60px]"
              >
                <div className="bg-white/90 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-xl flex items-center gap-4 max-w-60 hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <div className="bg-teal-50 p-3 rounded-xl text-teal-600">
                    <TrendingUp size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Efficiency</p>
                    <p className="text-xl font-extrabold text-slate-900">+45%</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-6 top-12 z-30 block translate-z-[80px]"
              >
                <div className="bg-white/90 backdrop-blur-xl border border-white p-5 rounded-2xl shadow-xl w-50 hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={20} className="text-blue-700" />
                    <span className="text-xs font-bold text-slate-700">Risk Free</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Compliance</span>
                      <span>98%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[98%] bg-blue-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>  
  );
};

export default Hero;