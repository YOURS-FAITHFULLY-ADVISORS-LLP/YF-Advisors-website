"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { 
  PieChart, Cpu, Share2, Search, Banknote, 
  FileText, Headphones, UserMinus, Settings, UserCheck, 
  LucideIcon 
} from "lucide-react";

// --- Types ---
interface Service {
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

interface IndicatorProps {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

// --- Services Data ---
const services: Service[] = [
  { 
    title: "Finance Consulting", 
    icon: PieChart, 
    color: "#0AA8A3",
    description: "Expert guidance to reduce costs, boost profitability, and navigate complex financial landscapes to achieve your business goals."
  },
  { 
    title: "Back Office Automation", 
    icon: Cpu, 
    color: "#0F172A",
    description: "Streamline operations using AI & RPA to automate repetitive tasks like data entry and invoice processing, freeing up your team."
  },
  { 
    title: "Functional Outsourcing", 
    icon: Share2, 
    color: "#0AA8A3",
    description: "Delegate specific functions like HR and Accounts Payable to specialized experts to improve efficiency and operational scalability."
  },
  { 
    title: "Mystery Audits", 
    icon: Search, 
    color: "#0F172A",
    description: "Gain unfiltered insights into customer experience and compliance through discreet, professional on-site evaluations."
  },
  { 
    title: "Payroll Management", 
    icon: Banknote, 
    color: "#0AA8A3",
    description: "End-to-end cloud-based payroll processing ensuring 100% accuracy, timely payments, and strict regulatory tax compliance."
  },
  { 
    title: "Bookkeeping Services", 
    icon: FileText, 
    color: "#0F172A",
    description: "Accurate tracking of financial transactions, statement preparation, and budgeting to keep your business audit-ready at all times."
  },
  { 
    title: "Virtual Assistant", 
    icon: Headphones, 
    color: "#0AA8A3",
    description: "Dedicated remote administrative support for email management, scheduling, travel, and day-to-day coordination."
  },
  { 
    title: "Attrition Management", 
    icon: UserMinus, 
    color: "#0F172A",
    description: "Strategic solutions to retain top talent, improve employee engagement, and significantly reduce workforce turnover rates."
  },
  { 
    title: "Process Outsourcing", 
    icon: Settings, 
    color: "#0AA8A3",
    description: "Optimize non-core activities like procurement, supply chain, and customer support to focus entirely on business growth."
  },
  { 
    title: "Manpower Outsourcing", 
    icon: UserCheck, 
    color: "#0F172A",
    description: "Flexible staffing solutions ranging from temporary project-based hires to permanent recruitment and executive search."
  },
];

const ServicesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Physics Smoothing
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.1,
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <section 
      id="services"
      ref={containerRef} 
      className={`relative bg-slate-50 ${isMobile ? "h-[1200vh]" : "h-[1000vh]"}`} 
    >
      <div className="sticky top-0 h-dvh w-full flex items-center justify-center overflow-hidden">
        
        {/* Dynamic Background Text */}
        <motion.div 
          style={{ opacity: useTransform(smoothProgress, [0, 0.1], [0.1, 0]) }}
          className="absolute inset-0 flex items-center justify-center select-none -z-10"
        >
          <span className="text-[15vw] md:text-[20vw] font-black text-[#E2E8F0]">SERVICES</span>
        </motion.div>

        {/* The Cards Stack */}
        <div className="relative w-full max-w-[90%] md:max-w-5xl h-[70vh] md:h-[70vh] flex items-center justify-center">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              service={service} 
              index={index} 
              total={services.length} 
              scrollYProgress={smoothProgress} 
            />
          ))}
        </div>

        {/* Scroll Progress Indicator - Dots */}
        <div className="absolute bottom-6 md:bottom-10 left-0 w-full flex justify-center gap-2 z-20">
           {services.map((_, i) => (
             <Indicator key={i} index={i} total={services.length} scrollYProgress={smoothProgress} />
           ))}
        </div>

      </div>
    </section>
  );
};

// Indicator Component
const Indicator: React.FC<IndicatorProps> = ({ index, total, scrollYProgress }) => {
    const step = 1 / total;
    const rangeStart = index * step;
    const rangeEnd = rangeStart + step;
    
    const opacity = useTransform(scrollYProgress, [rangeStart, rangeStart + 0.01, rangeEnd - 0.01, rangeEnd], [0.2, 1, 1, 0.2]);
    const scale = useTransform(scrollYProgress, [rangeStart, rangeStart + 0.01, rangeEnd], [0.8, 1.3, 0.8]);

    return (
        <motion.div 
            style={{ opacity, scale }}
            className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#0AA8A3]"
        />
    )
}

// Card Component
const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, total, scrollYProgress }) => {
  const Icon = service.icon;
  const step = 1 / total; 
  const start = index * step;
  const end = start + step;

  // --- ANIMATION LOGIC: X-AXIS (RIGHT TO LEFT) ---
  const x = useTransform(
    scrollYProgress, 
    [start - step, start], 
    index === 0 ? ["0%", "0%"] : ["110%", "0%"]
  );

  const scale = useTransform(
    scrollYProgress,
    [start, end],
    [1, 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    [start - step * 0.2, start],
    [0, 1]
  );

  return (
    <motion.div
      style={{
        x,
        scale,
        opacity: index === 0 ? 1 : opacity,
        zIndex: index,
      }}
      className="absolute w-full h-full flex items-center justify-center p-2 md:p-0"
    >
      <div 
        className="relative w-full aspect-4/5 md:aspect-21/9 bg-white border border-[#E5E7EB] rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 shadow-xl md:shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Card Header */}
        <div className="flex justify-between items-start z-10">
          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-opacity-10`} style={{ backgroundColor: `${service.color}15` }}>
            <Icon size={24} className="md:w-10 md:h-10" strokeWidth={1.5} color={service.color} />
          </div>
          <span className="text-lg md:text-2xl font-black text-[#CBD5E1] tracking-tighter">
            {index < 9 ? `0${index + 1}` : index + 1}
          </span>
        </div>

        {/* Card Content */}
        <div className="z-10 mt-auto md:mt-0 mb-2 md:mb-0">
          <h3 
            className="text-2xl md:text-5xl font-black uppercase tracking-tight mb-3 md:mb-4 leading-tight md:leading-tight"
            style={{ color: service.color }}
          >
            {service.title}
          </h3>
          
          <p className="text-sm md:text-lg font-medium text-slate-500 leading-relaxed md:max-w-xl line-clamp-4 md:line-clamp-none">
            {service.description}
          </p>

          <div className="flex items-center gap-3 md:gap-4 mt-4 md:mt-8">
            <div className="h-1 w-8 md:w-12" style={{ backgroundColor: service.color }} />
            <p className="text-[10px] md:text-xs font-bold text-[#64748B] uppercase tracking-widest">
              Professional Services
            </p>
          </div>
        </div>

        {/* Decorative Background Icon */}
        <div 
          className="absolute -right-8 -bottom-16 md:-right-10 md:-bottom-20 opacity-[0.04] pointer-events-none"
          style={{ color: service.color }}
        >
          <Icon size={200} className="md:w-100 md:h-100" strokeWidth={1} />
        </div>
      </div>
    </motion.div>
  );
};

export default ServicesSection;