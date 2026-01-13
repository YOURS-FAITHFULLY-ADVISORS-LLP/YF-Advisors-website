"use client";

import React from "react";
import CountUp from "react-countup";
import { motion, Variants } from "framer-motion";
import { Clock, TrendingUp, Zap, Users, ArrowUpRight } from "lucide-react";

const statsData = [
  {
    id: 1,
    value: 100,
    suffix: "K+",
    label: "Man Hours Served",
    icon: Clock,
    accent: "bg-blue-500",
  },
  {
    id: 2,
    value: 150,
    prefix: "$",
    suffix: "M",
    label: "Client Savings",
    icon: TrendingUp,
    accent: "bg-emerald-500",
  },
  {
    id: 3,
    value: 23,
    suffix: "%",
    label: "Efficiency Increase",
    icon: Zap,
    accent: "bg-amber-500",
  },
  {
    id: 4,
    value: 98,
    suffix: "%",
    label: "Client Retention",
    icon: Users,
    accent: "bg-purple-500",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50 } 
  },
};

const StatsSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/80 -z-20" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/40 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Driving Real Business Results
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg"
          >
            We don&apos;t just advise; we execute. Here is the tangible impact delivered across our global client base.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
        >
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                variants={item}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                className="group relative bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 border border-slate-100 transition-all duration-300"
              >
                <div className={`absolute top-0 left-6 right-6 h-1 ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg`} />

                <div className="flex flex-col items-start relative z-10">
                  <div className="w-full flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors duration-300 text-[#002B49]">
                      <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#002B49] mb-2 tracking-tight">
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      separator=","
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-widest group-hover:text-[#00A79D] transition-colors duration-300">
                    {stat.label}
                  </p>
                </div>
                
                <div className="absolute inset-0 bg-linear-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;