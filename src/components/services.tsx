"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { 
  PieChart, 
  Cpu, 
  Share2, 
  Search, 
  Banknote, 
  FileText, 
  Headphones, 
  UserCheck, 
  Settings, 
  Users 
} from "lucide-react";

// Data mapping for the 10 services shown in your image
const services = [
  { title: "Finance Consulting", icon: PieChart },
  { title: "Back Office Automation", icon: Cpu },
  { title: "Functional Outsourcing", icon: Share2 },
  { title: "Mystery Audits", icon: Search },
  { title: "Payroll Management", icon: Banknote },
  { title: "Bookkeeping Services", icon: FileText },
  { title: "Virtual Assistant", icon: Headphones },
  { title: "Attrition Management", icon: UserCheck },
  { title: "Process Outsourcing", icon: Settings },
  { title: "Manpower Outsourcing", icon: Users },
];

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  },
};

const ServicesSection = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Services We Provide
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1 bg-[#00A79D] mx-auto rounded-full mb-6"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-500 max-w-2xl mx-auto"
          >
            Comprehensive business solutions tailored to streamline your operations and maximize efficiency.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col items-center text-center h-full"
              >
                {/* Hover Gradient Border (Top) */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#002B49] to-[#00A79D] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-xl origin-left" />

                {/* Icon Circle */}
                <div className="mb-4 p-4 bg-slate-50 rounded-full text-[#002B49] group-hover:bg-[#002B49] group-hover:text-white transition-colors duration-300">
                  <Icon size={28} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-sm md:text-base font-bold text-slate-800 group-hover:text-[#00A79D] transition-colors duration-300">
                  {service.title}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;