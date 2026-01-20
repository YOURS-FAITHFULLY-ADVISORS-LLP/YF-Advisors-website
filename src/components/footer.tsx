"use client";

import React from "react";
import {
  Linkedin,
  Instagram,
  Facebook,
  MapPin,
  Phone,
  Mail,
  Youtube
} from "lucide-react";

const socialLinks = [
  {
    icon: Linkedin,
    url: "https://www.linkedin.com/company/yfadvisors",
  },
  {
    icon: Youtube,
    url: "https://www.youtube.com/channel/UCn9WNGp3sJi7YcbofSFh6pA",
  },
  {
    icon: Instagram,
    url: "https://www.instagram.com/yoursfaithfullyadvisors/",
  },
  {
    icon: Facebook,
    url: "https://www.facebook.com/yfadvisors",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 pt-16 pb-8 font-sans border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              YF Advisors
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              Empowering businesses with strategic financial clarity and operational excellence. We build the future of back-office management.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, url }, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-500 border border-slate-200 hover:bg-[#00A79D] hover:text-white hover:border-[#00A79D] transition-all duration-300 shadow-sm"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">
              Company
            </h3>

            <ul className="space-y-4">
              {[
                { label: 'About Us', href: '#about' },
                { label: 'Services', href: '#services' },
                { label: 'Our Team', href: '#team' },
                { label: 'Testimonials', href: '#testimonials' },
                { label: 'Blog', href: '#blog' },
                { label: 'Products', href: '#products' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-slate-600 text-sm hover:text-[#00A79D] transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#00A79D] shrink-0 mt-0.5" size={18} />
                <span className="text-slate-600 text-sm leading-relaxed">
                  207, 2nd Floor, Bldg No 1,<br />
                  Millenium Business Park,<br />
                  Navi Mumbai, 400710
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#00A79D] shrink-0" size={18} />
                <a href="tel:+918080506185" className="text-slate-600 text-sm hover:text-[#00A79D] transition-colors">
                  +91 80805 06185
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#00A79D] shrink-0" size={18} />
                <a href="mailto:hello@yfadvisors.in" className="text-slate-600 text-sm hover:text-[#00A79D] transition-colors">
                  info@yfadvisors.in
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Location Map */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Our Location</h3>

            {/* Map Container - No Animations */}
            <div className="rounded-lg overflow-hidden border border-slate-200 h-40 w-full relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.0!2d73.0174!3d19.1102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c0c6cc5a208b%3A0x46be7c5861c9ad76!2sYours%20Faithfully%20Advisors%20LLP!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="YF Advisors Location"
              ></iframe>

              {/* Overlay Label */}
              <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-700 flex items-center gap-1 shadow-sm pointer-events-none border border-slate-100">
                <MapPin size={12} className="text-[#00A79D]" /> Navi Mumbai, HQ
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} YF Advisors LLP. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-[#00A79D] text-sm transition-colors font-medium">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-[#00A79D] text-sm transition-colors font-medium">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}