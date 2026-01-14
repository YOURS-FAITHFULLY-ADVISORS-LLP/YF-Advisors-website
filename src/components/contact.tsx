"use client";

import React, { useState } from "react";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Facebook, 
  ChevronDown, 
  Check,
  ArrowRight
} from "lucide-react";

const SERVICES = [
  "Audit Veda",
  "PayVeda",
  "Financial Consulting",
  "General Inquiry",
];

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    service: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Form Data:", formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: "", email: "", contact: "", service: "", message: "" });
      }, 3000);
    }, 1500);
  };

  // --- Theme Colors ---
  // Teal: #00A79D
  // White: #FFFFFF
  // Black: #000000 (Borders/Shadows)

  const cardStyle = "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 rounded-lg";
  
  const inputStyle = `
    w-full bg-white border-2 border-black text-black 
    placeholder-gray-500 font-bold text-sm rounded-md h-12 px-4
    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    focus:outline-none focus:border-black focus:shadow-[4px_4px_0px_0px_#00A79D]
    transition-all duration-200
  `;

  const socialBtnStyle = `
    w-12 h-12 flex items-center justify-center 
    bg-white border-2 border-black rounded-full 
    shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
    hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#00A79D]
    active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
    transition-all duration-200 cursor-pointer group
  `;

  return (
    <section id="contact" className="w-full bg-white py-16 px-4 md:px-8 font-sans relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A79D] opacity-10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tight relative inline-block">
            Get In Touch
            {/* Underline Decoration */}
            <span className="absolute bottom-1 left-0 w-full h-3 bg-[#00A79D] -z-10 opacity-30 transform -skew-x-12"></span>
          </h2>
          <p className="text-lg text-gray-600 font-bold max-w-2xl mx-auto mt-2">
            Ready to grow your business? Drop us a line or visit our office.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* --- LEFT SIDE: Contact Info & Socials --- */}
          <div className="flex flex-col gap-8">
            
            {/* Contact Details Card */}
            <div className={cardStyle}>
              <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-2">
                Contact Info
                <div className="h-1 w-12 bg-[#00A79D] ml-2"></div>
              </h3>
              
              <div className="space-y-8">
                {/* Address */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-[#00A79D] text-white p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-md group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-black">Visit Us</h4>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      207, 2nd Floor, Bldg No 1, Millenium Business Park,
                      <br />
                      Navi Mumbai, 400710
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-[#00A79D] text-white p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-md group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-black">Email Us</h4>
                    <a href="mailto:hello@yfadvisors.com" className="text-gray-600 font-medium hover:text-[#00A79D] hover:underline decoration-2 underline-offset-2 transition-colors">
                      info@yfadvisors.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-[#00A79D] text-white p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-md group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-black">Call Us</h4>
                    <a href="tel:+919876543210" className="text-gray-600 font-medium hover:text-[#00A79D] transition-colors">
                      +91 80805 06185
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className={cardStyle}>
              <h3 className="text-xl font-black text-black mb-6">Follow Us</h3>
              <div className="flex gap-4 flex-wrap">
                <a href="#" className={socialBtnStyle}> <Linkedin className="text-black group-hover:text-[#00A79D] transition-colors" size={20} /> </a>
                <a href="#" className={socialBtnStyle}> <Twitter className="text-black group-hover:text-[#00A79D] transition-colors" size={20} /> </a>
                <a href="#" className={socialBtnStyle}> <Instagram className="text-black group-hover:text-[#00A79D] transition-colors" size={20} /> </a>
                <a href="#" className={socialBtnStyle}> <Facebook className="text-black group-hover:text-[#00A79D] transition-colors" size={20} /> </a>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: The Form --- */}
          {/* Main Container: TEAL Background */}
          <div className={`bg-[#00A79D] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10 rounded-xl h-full flex flex-col justify-center relative`}>
            
            {/* Decorative Corner Element */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white opacity-50"></div>

            <div className="mb-8">
              <h3 className="text-white font-black text-3xl md:text-4xl">Send a Message</h3>
              <p className="text-teal-50 font-bold mt-2 text-lg opacity-90">We usually respond within 24 hours.</p>
            </div>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <input
                      name="name"
                      placeholder="Your Name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      name="contact"
                      placeholder="Phone Number"
                      required
                      value={formData.contact}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>
                </div>

                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <div className="relative">
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className={`${inputStyle} appearance-none cursor-pointer bg-white`}
                  >
                    <option value="" disabled>Select a Service</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 text-black pointer-events-none" size={18} />
                </div>

                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputStyle} h-auto py-3 resize-none`}
                />

                {/* Submit Button: White on Teal */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full py-4 mt-2
                    bg-white border-2 border-black text-black
                    font-black text-lg uppercase tracking-wider
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]
                    active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    disabled:opacity-70 disabled:cursor-not-allowed
                    transition-all duration-200
                    flex items-center justify-center gap-2
                  "
                >
                  {isSubmitting ? "Sending..." : (
                    <>
                      Let&apos;s Talk <ArrowRight size={20} strokeWidth={3} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-100 animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 animate-bounce">
                  <Check size={48} className="text-[#00A79D]" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">Message Sent!</h3>
                <p className="text-teal-50 font-medium text-lg">Thank you for reaching out. <br/>We will get back to you shortly.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}