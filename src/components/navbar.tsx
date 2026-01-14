"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import usePathname
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Get current path to check if we are on Home page
  const pathname = usePathname();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Our Team", href: "/#team" },
    { name: "Product", href: "/#products" },
  ];

  // --- FIXED: Universal Scroll Handler ---
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // 1. Close mobile menu immediately
    setIsMobileMenuOpen(false);

    // 2. Check if the link is a hash link (e.g., /#contact or #contact)
    if (href.includes("#")) {
      const targetId = href.split("#")[1];
      const elem = document.getElementById(targetId);

      // 3. If element exists on CURRENT page, scroll to it manually
      if (elem) {
        e.preventDefault();
        const headerOffset = 100; // Height of your fixed header + padding
        const elementPosition = elem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } 
      // 4. If element doesn't exist (different page), let Next.js handle the routing naturally
    } else if (href === "/") {
      // Handle Scroll to Top for Home
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const glassPanel =
    "bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg shadow-slate-200/20 rounded-full transition-all duration-300";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "py-2" : "py-4 md:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* --- 1. Logo Section --- */}
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="group relative z-50 flex items-center gap-2 py-2 cursor-pointer"
          >
            {/* Logo */}
            <motion.div
              whileHover={{ rotate: 3, scale: 1.04 }}
              className="relative h-10 w-15 shrink-0"
            >
              <Image
                src="/logo copy.png"
                alt="YF Advisors"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Text */}
            <div className="flex flex-col justify-center leading-tight select-none">
              <span className="font-serif text-[10px] font-semibold tracking-widest text-slate-800 uppercase">
                Yours Faithfully
              </span>
              <span className="w-full h-px bg-[#FDB913] my-px rounded-full" />
              <span className="font-serif text-[11px] font-bold tracking-[0.18em] text-slate-800 uppercase">
                Advisors LLP
              </span>
            </div>
          </Link>

          {/* --- 2. Desktop Navigation --- */}
          <nav
            className={`hidden md:flex items-center p-1.5 gap-1 ${glassPanel}`}
          >
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative px-5 py-2.5 rounded-full text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {hoveredIndex === index && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/80 shadow-sm rounded-full -z-10 border border-gray-100"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* --- 3. Actions --- */}
          <div className="flex items-center gap-3">
            {/* Desktop Contact Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/#contact" // Updated to include / for reliability
                onClick={(e) => handleLinkClick(e, "/#contact")}
                className="hidden md:flex items-center gap-2 bg-[#002B49] text-white px-6 py-3 rounded-full text-sm font-bold tracking-wide shadow-lg shadow-blue-900/20 hover:bg-[#00A79D] transition-colors duration-300 group"
              >
                <span>Let&apos;s Talk</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden relative z-50 p-3 rounded-full text-slate-700 ${glassPanel}`}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* --- Mobile Full Screen Menu Overlay --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#F5F7FA] md:hidden flex flex-col items-center justify-center space-y-8"
          >
            <div className="flex flex-col items-center gap-6 w-full px-6">
              {[...navLinks, { name: "Contact", href: "/#contact" }].map(
                (link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                    className="w-full"
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="block w-full text-center text-2xl font-serif font-medium text-slate-800 hover:text-[#00A79D] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                )
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-10 text-slate-400 text-xs tracking-widest uppercase"
            >
              Yours Faithfully Advisors
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;