"use client";

import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { motion, Variants } from "framer-motion";
import { Clock, TrendingUp, Zap, Users } from "lucide-react";

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
      staggerChildren: 0.14,
      delayChildren: 0.4,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const StatsSection = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Most clean way to handle client-only animation start
  useEffect(() => {
    // Small delay helps avoid flash + gives better visual timing
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-20%] w-[60%] h-[60%] bg-teal-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-5"
          >
            Real Results, Real Impact
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-slate-600 max-w-3xl mx-auto text-lg md:text-xl"
          >
            Proven outcomes we consistently deliver for our clients across industries.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8"
        >
          {statsData.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.id}
                variants={item}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                className="group relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300"
              >
                {/* Top accent line on hover */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${stat.accent} rounded-t-3xl scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`}
                />

                <div className="relative z-10 flex flex-col items-start">
                  <div className="flex items-center justify-between w-full mb-6">
                    <div className="p-3.5 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                      <Icon className="w-7 h-7 md:w-8 md:h-8 text-slate-700" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="min-h-20 md:min-h-24 flex items-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B49] tracking-tight">
                      {shouldAnimate ? (
                        <CountUp
                          start={0}
                          end={stat.value}
                          duration={2.5}
                          separator=","
                          prefix={stat.prefix ?? ""}
                          suffix={stat.suffix ?? ""}
                          enableScrollSpy
                          scrollSpyDelay={100}
                          scrollSpyOnce
                        />
                      ) : (
                        // Static fallback for SSR + first render
                        <>
                          {stat.prefix ?? ""}
                          {stat.value}
                          {stat.suffix ?? ""}
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-wide mt-2 group-hover:text-[#00A79D] transition-colors">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;