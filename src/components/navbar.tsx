"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact", href: "/contact" },
  ];

  // Common style for the "Capsules"
  const containerStyle = "bg-slate-100/80 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-full transition-all duration-300";

  return (
    <header
      className={`
        fixed top-0 z-50 w-full transition-all duration-300
        ${scrolled 
          ? "py-2 md:py-3 bg-white/60 backdrop-blur-xl border-b border-gray-100" 
          : "py-3 md:py-5 bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        
        {/* --- 1. Logo Capsule --- */}
        <Link 
          href="/" 
          className={`relative z-10 flex items-center gap-2 md:gap-3 group shrink-0 px-3 py-2 md:px-5 md:py-2 ${containerStyle}`}
        >
          {/* Logo Icon */}
          <div className="relative h-8 w-8 md:h-10 md:w-10 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Company Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Text Block */}
          <div className="flex flex-col items-center leading-none">
            <span className="font-serif text-[8px] md:text-[10px] font-bold tracking-widest text-slate-900 uppercase whitespace-nowrap">
              Yours Faithfully
            </span>
            <span className="w-full h-[1.5px] bg-[#FDB913] my-[1px] rounded-full"></span>
            <span className="font-serif text-[10px] md:text-[12px] font-bold tracking-[0.2em] text-slate-900 uppercase">
              Advisors
            </span>
          </div>
        </Link>

        {/* --- 2. Navigation Capsule (Hidden on Mobile) --- */}
        <nav className="hidden md:flex items-center">
          <div className={`flex items-center px-1.5 py-1.5 ${containerStyle}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="
                  px-5 py-2 rounded-full text-sm font-semibold text-slate-600
                  transition-all duration-300 ease-out
                  hover:bg-white hover:text-[#00A79D] hover:shadow-md
                "
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* --- 3. Actions Capsule (Download + Mobile Menu) --- */}
        <div className={`flex items-center gap-2 p-1.5 ${containerStyle}`}>
          
          {/* Download Button */}
          <a
            href="/brochure/YF-Advsiors-Brochure.pdf"
            download="YF-Advsiors-Brochure"
            className="
              flex items-center gap-1.5 md:gap-2 bg-[#002B49] text-white 
              px-3 py-2 md:px-5 md:py-2.5 rounded-full
              text-[11px] md:text-sm font-bold tracking-wide shadow-md
              transition-all duration-300 hover:bg-[#00A79D] hover:shadow-lg hover:-translate-y-0.5
              whitespace-nowrap
            "
          >
            <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden lg:block">Download Brochure</span>
            <span className="block lg:hidden">Brochure</span>
          </a>

          {/* Mobile Menu Toggle (Inside the capsule) */}
          <button 
            className="md:hidden p-2 text-slate-700 bg-white rounded-full hover:bg-slate-50 transition-colors border border-slate-100 shadow-sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Dropdown Menu --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[calc(100%+10px)] left-4 right-4 z-40 animate-in slide-in-from-top-5 duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden p-2">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="
                    px-4 py-3 text-slate-700 text-sm font-bold rounded-xl text-center
                    hover:bg-slate-50 hover:text-[#00A79D] transition-all duration-200
                  "
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;