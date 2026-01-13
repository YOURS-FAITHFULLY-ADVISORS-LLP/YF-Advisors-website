"use client";

import React from "react";
import { Truck, Users, Search, UtensilsCrossed, ArrowDownToLine, FileText } from "lucide-react";
import { motion, Variants } from "framer-motion"; // 1. Import Variants type

const brochures = [
  {
    title: "Logistics AP Process",
    subtitle: "Procure-to-Pay",
    desc: "Streamline payables with automated workflows and real-time tracking.",
    icon: <Truck strokeWidth={1.5} className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
    file: "/brochure/YF-Advsiors-Brochure.pdf", 
    fileName: "YF-Advisors-Logistics-Brochure.pdf"
  },
  {
    title: "Manpower Solutions",
    subtitle: "Workforce",
    desc: "Scalable staffing models designed for rapid operational growth.",
    icon: <Users strokeWidth={1.5} className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    file: "/brochure/YF-Advsiors-Brochure.pdf",
    fileName: "YF-Advisors-Manpower-Brochure.pdf"
  },
  {
    title: "Mystery Audits",
    subtitle: "CX Insights",
    desc: "Uncover hidden data points in your customer experience journey.",
    icon: <Search strokeWidth={1.5} className="w-6 h-6" />,
    color: "from-teal-500 to-emerald-500",
    bg: "bg-teal-50",
    text: "text-teal-600",
    file: "/brochure/YF-Advsiors-Brochure.pdf",
    fileName: "YF-Advisors-Audit-Brochure.pdf"
  },
  {
    title: "Restaurant Product",
    subtitle: "F&B Operations",
    desc: "Optimize daily operations from kitchen prep to table service.",
    icon: <UtensilsCrossed strokeWidth={1.5} className="w-6 h-6" />,
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    text: "text-orange-600",
    file: "/brochure/YF-Advsiors-Brochure.pdf",
    fileName: "YF-Advisors-Restaurant-Brochure.pdf"
  },
];

// --- Animations ---

// 2. Explicitly type the variants using ': Variants'
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const Brochure = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[40px_40px] opacity-70"></div>

        {/* --- Header --- */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[11px] font-bold tracking-wide uppercase mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Knowledge Center
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            Download Our Service Guides
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg leading-relaxed"
          >
            Get detailed insights into our methodologies. Access comprehensive breakdowns of how we optimize enterprise operations.
          </motion.p>
        </div>

        {/* --- Brochure Grid --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
        >
          {brochures.map((item, index) => (
            <motion.a 
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              href={item.file}
              download={item.fileName}
              className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
            >
              {/* Top Gradient "Cover" Area */}
              <div className={`h-2 bg-gradient-to-r ${item.color}`} />
              
              <div className="p-6 md:p-8 flex flex-col h-full">
                {/* Icon Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.text} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  {/* Fake "File" icon in corner */}
                  <div className="text-slate-200 group-hover:text-slate-300 transition-colors">
                    <FileText size={24} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${item.text}`}>
                    {item.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#002B49] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Action Area */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between group/btn">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-[#002B49] transition-colors">
                    Download PDF
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#002B49] group-hover:text-white transition-all duration-300">
                    <ArrowDownToLine size={14} className="group-hover:animate-bounce" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Brochure;