"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  RefreshCw, 
  X, 
  MessageCircle,
  ChevronDown
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hey there! 👋 I'm the YF Advisors Assistant. Ask me anything about audits, payroll, or financial consulting!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100); // Small delay to ensure render
      // Prevent body scrolling on mobile when chat is open
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "I'm currently in demo mode! 🚀 Once connected to the backend, I'll fetch real-time data for you.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([{
      id: "1",
      role: "bot",
      content: "Chat cleared! 🧹 Ready for new questions.",
      timestamp: new Date(),
    }]);
  };

  return (
    <>
      {/* --- Chat Window --- */}
      <div 
        className={`
          fixed z-9999 transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col border border-white/20 ring-1 ring-black/5
          ${isOpen 
            ? "opacity-100 pointer-events-auto translate-y-0 scale-100" 
            : "opacity-0 pointer-events-none translate-y-10 scale-95"
          }
          /* MOBILE: Full Screen */
          inset-0 w-full h-dvh rounded-none
          
          /* DESKTOP: Floating Card */
          md:inset-auto md:bottom-24 md:right-8 md:w-100 md:h-162.5 md:max-h-[85vh] md:rounded-4xl
        `}
      >
        
        {/* Header - Modern Gradient & Blur */}
        <div className="bg-linear-to-br from-[#00A79D] to-teal-800 p-5 flex items-center justify-between shrink-0 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-inner">
              <Bot className="text-white w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">YF Assistant</h1>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <p className="text-teal-50 text-xs font-medium opacity-90">Always Active</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 relative z-10">
            <button 
              onClick={clearChat} 
              className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
              title="Clear Chat"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
            >
              <ChevronDown className="md:hidden" size={24} />
              <X className="hidden md:block" size={22} />
            </button>
          </div>
        </div>

        {/* Messages Area - Clean & Spacious */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} group`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-black/5 ${msg.role === "user" ? "bg-gray-900 text-white" : "bg-white text-[#00A79D]"}`}>
                {msg.role === "user" ? <User size={14} strokeWidth={2.5} /> : <Bot size={16} strokeWidth={2.5} />}
              </div>

              {/* Bubble */}
              <div 
                className={`
                  max-w-[80%] px-5 py-3.5 shadow-sm text-[15px] leading-relaxed relative transition-all duration-200
                  ${msg.role === "user" 
                    ? "bg-[#00A79D] text-white rounded-3xl rounded-tr-sm" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-3xl rounded-tl-sm"
                  }
                `}
              >
                <p>{msg.content}</p>
                <span 
                  className={`text-[10px] font-medium absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    msg.role === "user" ? "right-1 text-slate-400" : "left-1 text-slate-400"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#00A79D] flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-100 px-4 py-4 rounded-3xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Floating Pill Style */}
        <div className="bg-white p-4 md:p-5 border-t border-slate-100 shrink-0">
          <form 
            onSubmit={handleSend} 
            className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 border border-transparent hover:border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00A79D]/20 focus-within:border-[#00A79D] rounded-full px-1.5 py-1.5 transition-all duration-200 shadow-sm"
          >
            <div className="pl-3 text-slate-400">
              <Sparkles size={18} strokeWidth={2} />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-sm md:text-[15px] h-11 font-medium px-2"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading} 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                ${!input.trim() || isLoading 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-[#00A79D] text-white hover:bg-teal-700 hover:scale-105 shadow-md"
                }
              `}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" strokeWidth={2.5} />}
            </button>
          </form>
          <div className="flex justify-center mt-3">
             <p className="text-[10px] font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                Powered by YF AI
             </p>
          </div>
        </div>
      </div>

      {/* --- Floating Toggle Button --- */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-9990
          group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] shadow-xl shadow-[#00A79D]/30 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) bg-[#00A79D] hover:bg-teal-700 hover:-translate-y-1
          ${isOpen ? "scale-0 opacity-0 pointer-events-none rotate-90" : "scale-100 opacity-100 rotate-0"}
        `}
      >
        <MessageCircle className="text-white w-7 h-7 md:w-8 md:h-8 transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
        
        {/* Notification Dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-[3px] border-white shadow-sm animate-bounce"></span>
      </button>
    </>
  );
}