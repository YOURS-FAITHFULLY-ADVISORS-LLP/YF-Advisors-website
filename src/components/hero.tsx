"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, CheckCircle2 } from "lucide-react";

const Hero = () => {
  return (
    <section 
      id="home" 
      className="relative w-full pt-16 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-white"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#00A79D]/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          <div className="flex-1 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold tracking-wide uppercase mb-6 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Strategic Advisory 2.0
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-[64px] leading-[1.1] font-extrabold text-slate-900 mb-6 tracking-tight">
              Grow Your Business <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A79D] to-[#007f77]">
                Not Your Back Office
              </span>
            </h1>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 font-medium">
              Maximize efficiency with customized Global Business Services (GBS). 
              We tailor outsourcing strategies that align costs with value, leveraging 
              tech to transform your chaos into a competitive advantage.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/contact"
                className="group relative px-8 py-3.5 bg-[#002B49] text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Connect now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00A79D] to-[#002B49] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link 
                href="/services"
                className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm"
              >
                Explore Services
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-6 text-slate-400 text-sm font-semibold">
              <span>TRUSTED BY INNOVATORS</span>
              <div className="flex -space-x-3">
                 <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                 <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                 <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-[9px] text-white">50+</div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#00A79D] to-blue-500 rounded-[2rem] opacity-20 blur-2xl -z-10 animate-pulse-slow"></div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
              <Image 
                src="/hero/hero.png"
                alt="Strategic Business Meeting"
                width={800}
                height={600}
                className="object-cover w-full h-[400px] lg:h-[500px]"
                priority
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="absolute -left-6 bottom-12 bg-white/90 backdrop-blur-md border border-white/50 p-4 rounded-xl shadow-xl flex items-center gap-4 animate-float">
              <div className="bg-green-100 p-2.5 rounded-lg text-green-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Efficiency</p>
                <p className="text-lg font-bold text-slate-900">+45% Growth</p>
              </div>
            </div>

            <div className="absolute -right-6 top-16 bg-white/90 backdrop-blur-md border border-white/50 p-4 rounded-xl shadow-xl flex flex-col gap-2 animate-float-delayed hidden sm:flex">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-1">
                <CheckCircle2 size={16} className="text-[#00A79D]" />
                <span className="text-xs font-bold text-slate-700">Back Office Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[80%] bg-[#00A79D] rounded-full"></div>
                 </div>
                 <span className="text-[10px] font-bold text-slate-500">80% Done</span>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 5s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  );
};

export default Hero;