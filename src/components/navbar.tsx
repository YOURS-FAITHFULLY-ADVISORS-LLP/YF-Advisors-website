"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled((prev) => {
            const isScrolledNow = window.scrollY > 20;
            return prev !== isScrolledNow ? isScrolledNow : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when the sidebar is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close sidebar automatically if the viewport grows past the lg breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about-us" },
    { name: "Services", href: "/#services" },
    { name: "Gallery", href: "/#highlights" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Our Team", href: "/#our-team" },
    { name: "Product", href: "/#products" },
    { name: "Blogs", href: "/blog" },
  ];

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";

    if (href.includes("#")) {
      const parts = href.split("#");
      const targetPath = parts[0] || "/";
      const targetId = parts[1];

      // Only prevent default if we are currently on the target page
      if (pathname === targetPath || (targetPath === "/" && pathname === "/")) {
        e.preventDefault();
        
        setTimeout(() => {
          document.body.style.overflow = "";
          const elem = document.getElementById(targetId);
          if (elem) {
            const headerOffset = 80;
            const elementPosition = elem.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          } else if (lenis) {
            lenis.scrollTo(`#${targetId}`, { offset: -80, duration: 1.2 });
          }
        }, 50);
        window.history.pushState(null, "", `#${targetId}`);
      }
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      setTimeout(() => {
        document.body.style.overflow = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
      window.history.pushState(null, "", "/");
    }
  };

  const glassPanel =
    "bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(15,23,42,0.08)] rounded-full transition-all duration-300";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? "py-2 bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/50" 
            : "py-3 md:py-4 bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-3">
          {/* --- 1. Logo Section --- */}
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="group relative z-50 flex items-center gap-2.5 py-2 shrink-0 cursor-pointer"
          >
            <div className="relative h-10 w-14 md:h-14 md:w-20 shrink-0">
              <Image
                src="/logo.webp"
                alt="Yours Faithfully Advisors"
                fill
                className="object-contain"
                priority
              />
            </div>

            <span className="font-bodoni italic text-xl md:text-2xl font-bold tracking-tight select-none whitespace-nowrap">
              <span className="text-[#2E5E7E]">YF</span>{" "}
              <span className="text-[#0F172A]">Advisors</span>
              <span className="text-[#C9A227] not-italic ml-[1px]">.</span>
            </span>
          </Link>

          {/* --- 2. Desktop Navigation (floating pill, lg and up only) --- */}
          <nav
            className={`hidden lg:flex items-center p-1 gap-0.5 xl:gap-1 shrink-0 ${glassPanel}`}
          >
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative whitespace-nowrap px-3 xl:px-4 py-2.5 rounded-full text-[13px] xl:text-sm font-medium tracking-wide text-slate-600 transition-colors hover:text-slate-900"
              >
                {hoveredIndex === index && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 border border-slate-100"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* --- 3. Actions --- */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden lg:block"
            >
              <Link
                href="/#contact"
                onClick={(e) => handleLinkClick(e, "/#contact")}
                className="flex items-center gap-2 whitespace-nowrap bg-[#002B49] text-white px-5 xl:px-6 py-3 rounded-full text-sm font-bold tracking-wide shadow-lg shadow-blue-900/20 hover:bg-[#00A79D] transition-colors duration-300 group"
              >
                <span>Let&apos;s Talk</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Floating rounded trigger — mobile/tablet only, opens the sidebar drawer */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              className={`lg:hidden relative z-50 p-3 rounded-full text-slate-700 ${glassPanel}`}
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* --- Mobile Sidebar Drawer --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />

            {/* Sliding panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 z-50 h-full w-[80%] max-w-sm bg-[#F9FAFB] shadow-2xl lg:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/70">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-9 w-12 shrink-0">
                    <Image
                      src="/logo.webp"
                      alt="Yours Faithfully Advisors"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-serif text-[11px] font-bold tracking-[0.15em] uppercase text-slate-900">
                    YF Advisors
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="group flex items-center justify-between py-3.5 px-4 rounded-2xl text-lg font-serif font-medium text-slate-800 hover:bg-white hover:text-[#00A79D] hover:shadow-sm transition-all"
                    >
                      {link.name}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA footer */}
              <div className="px-6 py-6 border-t border-slate-200/70">
                <Link
                  href="/#contact"
                  onClick={(e) => handleLinkClick(e, "/#contact")}
                  className="flex items-center justify-center gap-2 w-full bg-[#002B49] text-white px-6 py-3.5 rounded-full text-sm font-bold tracking-wide shadow-lg shadow-blue-900/20 hover:bg-[#00A79D] transition-colors duration-300"
                >
                  <span>Let&apos;s Talk</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="mt-4 text-center text-[10px] tracking-widest uppercase text-slate-400">
                  Yours Faithfully Advisors
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;