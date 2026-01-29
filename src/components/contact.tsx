"use client";

import React, { useState } from "react";
import { 
  Mail, 
  MapPin, 
  Phone, 
  YoutubeIcon, 
  Linkedin, 
  Instagram, 
  Facebook, 
  ChevronDown, 
  Check,
  ArrowRight,
  Send
} from "lucide-react";

const SERVICES = [
  "Audit Veda",
  "PayVeda",
  "Financial Consulting",
  "General Inquiry",
];

const SOCIAL_LINKS = [
  {
    icon: Linkedin,
    url: "https://www.linkedin.com/company/yfadvisors",
  },
  {
    icon: YoutubeIcon,
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

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    service: "",
    message: "",
  });

  // Fixed: Added explicit type for the change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  // Fixed: Added explicit type for the form submit event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", contact: "", service: "", message: "" });
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

    } catch (error) {
      // Fixed: Type narrowing for 'unknown' error type
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseStyle = `
    w-full bg-teal-800/20 text-white placeholder-teal-200/60
    border border-teal-500/30 rounded-xl px-4 py-3.5
    focus:outline-none focus:bg-teal-900/40 focus:border-teal-300 focus:ring-1 focus:ring-teal-300
    transition-all duration-300 backdrop-blur-sm
  `;

  const socialBtnStyle = `
    w-10 h-10 flex items-center justify-center 
    bg-white border border-gray-100 rounded-full text-gray-500 shadow-sm
    hover:bg-[#00A79D] hover:text-white hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-1
    transition-all duration-300
  `;

  return (
    <section className="relative w-full py-24 px-4 md:px-8 font-sans overflow-hidden bg-gray-50">
      
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-linear(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-teal-100 text-[#00A79D] text-xs font-bold tracking-wider uppercase mb-4">
            Contact Us
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Let&apos;s Start a Conversation
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Ready to scale your business? We are here to provide the financial expertise you need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-white relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-[#00A79D] to-teal-600 transition-all duration-300 group-hover:w-2"></div>

              <h3 className="text-xl font-bold text-gray-900 mb-8">Contact Details</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-linear-to-br from-[#00A79D] to-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Our Office</h4>
                    <p className="text-gray-500 text-sm leading-relaxed mt-1">
                      207, 2nd Floor, Bldg No 1,<br/>Millenium Business Park, Sector-2 Mahape,<br/>Navi Mumbai, 400710
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-linear-to-br from-[#00A79D] to-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Email Us</h4>
                    <a href="mailto:info@yfadvisors.com" className="text-gray-500 text-sm mt-1 block hover:text-[#00A79D] transition-colors">
                      info@yfadvisors.in
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-linear-to-br from-[#00A79D] to-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Call Us</h4>
                    <a href="tel:+918080506185" className="text-gray-500 text-sm mt-1 block hover:text-[#00A79D] transition-colors">
                      +91 80805 06185
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-white flex items-center justify-between">
              <span className="font-bold text-gray-900 ml-2">Follow our socials</span>
              <div className="flex gap-2">
                {SOCIAL_LINKS.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialBtnStyle}
                  > 
                    <item.icon size={18} /> 
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="h-full bg-linear-to-br from-gray-900 via-gray-800 to-black p-1 rounded-3xl shadow-2xl shadow-gray-900/20">
              <div className="h-full bg-[#002825] rounded-[22px] relative overflow-hidden p-8 md:p-12">
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A79D] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600 opacity-10 blur-[60px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="mb-10">
                    <h3 className="text-white font-bold text-3xl flex items-center gap-3">
                      Send a Message 
                      <Send className="text-[#00A79D]" size={24} />
                    </h3>
                    <p className="text-gray-400 mt-2">
                      Fill out the form below and our team will get back to you within 24 hours.
                    </p>
                  </div>

                  {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-teal-300 ml-1 uppercase tracking-wider">Your Name</label>
                          <input
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className={inputBaseStyle}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-teal-300 ml-1 uppercase tracking-wider">Phone Number</label>
                          <input
                            name="contact"
                            required
                            value={formData.contact}
                            onChange={handleChange}
                            className={inputBaseStyle}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-teal-300 ml-1 uppercase tracking-wider">Email Address</label>
                        <input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={inputBaseStyle}
                        />
                      </div>

                      <div className="space-y-2 relative">
                        <label className="text-xs font-semibold text-teal-300 ml-1 uppercase tracking-wider">Service Interested In</label>
                        <div className="relative">
                          <select
                            name="service"
                            required
                            value={formData.service}
                            onChange={handleChange}
                            className={`${inputBaseStyle} appearance-none cursor-pointer bg-transparent`}
                          >
                            <option value="" disabled className="bg-gray-800 text-gray-400">Select a Service</option>
                            {SERVICES.map((s) => (
                              <option key={s} value={s} className="bg-gray-800 text-white">{s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-4 text-teal-300 pointer-events-none" size={16} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-teal-300 ml-1 uppercase tracking-wider">Message</label>
                        <textarea
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          className={`${inputBaseStyle} resize-none h-32`}
                        />
                      </div>
                      
                      {errorMessage && (
                        <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="
                          w-full py-4 mt-4
                          bg-linear-to-r from-[#00A79D] to-teal-600
                          text-white font-bold text-lg tracking-wide
                          rounded-xl shadow-lg shadow-teal-900/50
                          hover:shadow-teal-500/40 hover:scale-[1.01]
                          active:scale-[0.98]
                          disabled:opacity-70 disabled:cursor-not-allowed
                          transition-all duration-300
                          flex items-center justify-center gap-2 group
                        "
                      >
                        {isSubmitting ? "Sending..." : (
                          <>
                            Send Message 
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-linear-to-tr from-[#00A79D] to-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30">
                        <Check size={40} className="text-white" strokeWidth={3} />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-300">We&apos;ve received your inquiry and will get back to you shortly.</p>
                      
                      <button 
                        onClick={() => setIsSuccess(false)}
                        className="mt-8 text-teal-300 hover:text-white transition-colors text-sm underline underline-offset-4"
                      >
                        Send another message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}