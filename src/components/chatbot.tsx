"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  RefreshCcw, 
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
      content: "Hello! I am the YF Advisors AI assistant. How can I help you with your financial or audit queries today?",
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
      scrollToBottom();
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
        content: "Thank you for your message. I am currently a demo interface. Please connect my API to get real financial advice!",
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
      content: "Chat cleared. How can I help you now?",
      timestamp: new Date(),
    }]);
  };

  return (
    <>
      {/* --- Chat Window --- */}
      <div 
        className={`
          fixed z-9999 transition-all duration-300 ease-in-out bg-white shadow-2xl overflow-hidden flex flex-col border border-gray-200
          ${isOpen 
            ? "opacity-100 pointer-events-auto translate-y-0" 
            : "opacity-0 pointer-events-none translate-y-10"
          }
          /* MOBILE STYLES: Full Screen */
          inset-0 w-full h-dvh rounded-none
          
          /* DESKTOP STYLES: Floating Bottom Right */
          md:inset-auto md:bottom-24 md:right-6 md:w-95 md:h-150 md:max-h-[80vh] md:rounded-2xl
        `}
      >
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#00A79D] to-teal-700 p-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Bot className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base md:text-lg">YF Advisors Assistant</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <p className="text-teal-100 text-xs">Online</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={clearChat} className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
              <RefreshCcw size={18} />
            </button>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
              {/* Show Chevron on Mobile, X on Desktop */}
              <ChevronDown className="md:hidden" size={24} />
              <X className="hidden md:block" size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-gray-200 text-gray-600" : "bg-teal-100 text-[#00A79D]"}`}>
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm relative text-sm md:text-base ${msg.role === "user" ? "bg-[#00A79D] text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <span className={`text-[10px] absolute bottom-1 ${msg.role === "user" ? "text-teal-100 right-3" : "text-gray-400 left-3"} opacity-70`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-[#00A79D] flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-0"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-3 md:p-4 border-t border-gray-100 shrink-0 safe-area-bottom">
          <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-2 focus-within:ring-2 focus-within:ring-[#00A79D]/20 focus-within:border-[#00A79D] transition-all shadow-sm">
            <Sparkles size={18} className="text-gray-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 text-sm md:text-base h-10"
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading} className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${!input.trim() || isLoading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#00A79D] text-white hover:bg-teal-700 shadow-md"}`}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 mt-2">Powered by YF Advisors AI</p>
        </div>
      </div>

      {/* --- Toggle Button (Visible when chat is closed) --- */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-9990
          group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg shadow-teal-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 bg-[#00A79D] hover:bg-teal-600
          ${isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}
        `}
      >
        <MessageCircle className="text-white w-7 h-7 md:w-8 md:h-8" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>
    </>
  );
}