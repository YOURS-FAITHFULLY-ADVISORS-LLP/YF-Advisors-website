"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RefreshCw, 
  MessageCircle,
  ChevronDown,
  MoreVertical,
  Trash2,
  Minimize2
} from "lucide-react";

// --- TYPES ---
type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
};

type ChatState = "init" | "name_verification" | "chatting";

interface ServerMessage {
  _id?: string;
  id?: string;
  sender?: string;
  role?: string;
  from?: string;
  text?: string;
  content?: string;
  message?: string;
  timestamp?: string | number;
  createdAt?: string | number;
}

interface ApiResponse {
  success?: boolean;
  verified?: boolean;
  message?: string;
  userId?: string;
  user_id?: string;
  messages?: ServerMessage[];
  data?: {
    messages: ServerMessage[];
  };
}

// --- CONSTANTS ---
const API_BASE = "/api/chat";

// --- API UTILITY ---
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('/') ? endpoint : `${API_BASE}${endpoint}`;
  
  try {
    const fetchOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };
    
    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');
    
    let data: ApiResponse;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }
    
    return { response, data, ok: response.ok };
  } catch (error) {
    console.error(`❌ API Error:`, error);
    throw error;
  }
}// --- FORMATTED MESSAGE RENDERER ---
function parseBoldAndLinks(text: string): React.ReactNode {
  // Regex matches markdown links [Text](URL), raw URLs, or bold text **Bold**
  const regex = /(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+|\*\*.*?\*\*)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-slate-900">
          {boldText}
        </strong>
      );
    }

    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const linkText = match[1];
        const url = match[2];
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00A79D] font-medium underline underline-offset-2 hover:text-teal-700 transition-colors"
          >
            {linkText}
          </a>
        );
      }
    }

    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00A79D] font-medium underline underline-offset-2 hover:text-teal-700 transition-colors break-all"
        >
          {part}
        </a>
      );
    }

    return part;
  });
}

function FormattedChatMessage({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) {
    return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>;
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    let cleanLine = line.trim();
    if (!cleanLine) {
      elements.push(<div key={idx} className="h-1" />);
      return;
    }

    // 1. Handle markdown header symbols (###, ##, #)
    if (cleanLine.startsWith('#')) {
      cleanLine = cleanLine.replace(/^#+\s*/, '').replace(/\*\*/g, '');
      elements.push(
        <div key={idx} className="font-bold text-slate-900 text-sm mt-2 mb-1 border-b border-slate-100 pb-0.5 text-[#002B49]">
          {cleanLine}
        </div>
      );
      return;
    }

    // 2. Handle bullet items (- , * , • )
    const isBullet = /^[•\-\*]\s+/.test(cleanLine);
    if (isBullet) {
      cleanLine = cleanLine.replace(/^[•\-\*]\s+/, '');
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1.5 text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A79D] shrink-0 mt-1.5" />
          <div className="flex-1 leading-normal">{parseBoldAndLinks(cleanLine)}</div>
        </div>
      );
      return;
    }

    // 3. Normal paragraph line
    elements.push(
      <p key={idx} className="my-1 leading-relaxed text-slate-700">
        {parseBoldAndLinks(cleanLine)}
      </p>
    );
  });

  return <div className="space-y-1 text-xs sm:text-sm">{elements}</div>;
}

const QUICK_SUGGESTIONS = [
  "What services do you offer?",
  "Bookkeeping & Payroll",
  "GST & ROC Filing",
  "Contact Info & Office Hours",
];

// --- COMPONENT ---
export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>("user_guest");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Client Mount Guard to eliminate SSR Hydration Mismatch
  useEffect(() => {
    setMounted(true);
    setUserId(`user_${Date.now()}`);
    setMessages([
      {
        id: "welcome",
        role: "bot",
        content: "Hey there! 👋 Welcome to YF Advisors Client Support. How can I assist you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  // --- CLICK OUTSIDE HANDLER (Closes chatbot when clicking on blank space outside) ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close dropdown menu if open and clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }

      // Close chatbot widget if open and clicked on blank space outside
      if (isOpen) {
        const isOutsideWidget = widgetRef.current && !widgetRef.current.contains(target);
        const isOutsideToggleBtn = toggleBtnRef.current && !toggleBtnRef.current.contains(target);

        if (isOutsideWidget && isOutsideToggleBtn) {
          setIsOpen(false);
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // --- EFFECTS ---
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden'; 
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      setTimeout(scrollToBottom, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, scrollToBottom]);

  // --- ACTIONS ---
  const sendMessage = async (messageText: string) => {
    try {
      const { data, ok } = await apiCall('/api/chat', {
        method: "POST",
        body: JSON.stringify({ userId, message: messageText }),
      });

      if (!ok || !data?.success) throw new Error("Failed to send message");

      const botReply = data.message || data.messages?.[0]?.content || "Thank you for contacting YF Advisors!";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: botReply,
          timestamp: new Date(),
        },
      ]);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error';
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "bot",
        content: `Sorry, I couldn't process your request: ${msg}`,
        timestamp: new Date(),
      }]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    
    setMessages((prev) => [...prev, {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }]);
    
    setInput("");
    setIsLoading(true);

    await sendMessage(messageText);
    setIsLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  const handleChipClick = async (chipText: string) => {
    if (isLoading) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: chipText,
        timestamp: new Date(),
      },
    ]);
    setIsLoading(true);
    await sendMessage(chipText);
    setIsLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  const handleManualRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "bot",
        content: "Chat cleared! How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setIsDropdownOpen(false);
  };

  const temporaryClose = () => {
    setIsDropdownOpen(false);
    setIsOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div 
        ref={widgetRef}
        className={`
          fixed z-9999 flex flex-col overflow-hidden bg-white/95 shadow-2xl border border-white/20 ring-1 ring-black/5 transition-all duration-300 ease-in-out
          ${isOpen 
            ? "opacity-100 pointer-events-auto translate-y-0 scale-100 backdrop-blur-md" 
            : "opacity-0 pointer-events-none translate-y-10 scale-95 hidden"
          }
          /* Mobile: Full Screen, Dynamic Height */
          inset-0 w-full h-dvh rounded-none
          /* Desktop: Floating Card */
          md:inset-auto md:bottom-24 md:right-8 md:w-100 md:h-162.5 md:max-h-[85vh] md:rounded-4xl
        `}
      >
        {/* HEADER */}
        <div className="bg-linear-to-br from-[#00A79D] to-teal-800 p-4 md:p-5 flex items-center justify-between shrink-0 relative overflow-visible z-50">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-inner">
              <Bot className="text-white w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-white font-bold text-base md:text-lg tracking-tight">Client Support</h1>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <p className="text-teal-50 text-[10px] md:text-xs font-medium opacity-90">
                  Always Active
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-1 relative z-10 items-center">
            <button 
              onClick={handleManualRefresh} 
              className={`text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 cursor-pointer ${isLoading ? 'animate-spin' : ''}`} 
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>

            <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 cursor-pointer"
                >
                  <MoreVertical size={20} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={clearChat}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-b border-slate-50 cursor-pointer"
                    >
                      <Trash2 size={16} />
                      Clear Chat
                    </button>
                    <button 
                      onClick={temporaryClose}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Minimize2 size={16} />
                      Minimize
                    </button>
                  </div>
                )}
            </div>

            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 md:hidden cursor-pointer">
              <ChevronDown size={24} />
            </button>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div 
          className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-5 space-y-4 md:space-y-6 bg-slate-50 min-h-0 overscroll-contain pointer-events-auto touch-pan-y focus:outline-none select-text border-t border-b border-slate-100"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 md:gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} group`}>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-black/5 ${msg.role === "user" ? "bg-gray-900 text-white" : "bg-white text-[#00A79D]"}`}>
                {msg.role === "user" ? <User size={14} strokeWidth={2.5} /> : <Bot size={16} strokeWidth={2.5} />}
              </div>
              <div className={`
                  max-w-[85%] md:max-w-[82%] 
                  px-4 py-3 md:px-5 md:py-3.5 
                  shadow-sm text-[13px] md:text-[14px] leading-relaxed 
                  relative transition-all duration-200 wrap-break-word
                  ${msg.role === "user" 
                    ? "bg-[#00A79D] text-white rounded-3xl rounded-tr-sm" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-3xl rounded-tl-sm"
                  }
              `}>
                <FormattedChatMessage content={msg.content} isUser={msg.role === "user"} />
                <span className={`text-[10px] font-medium absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${msg.role === "user" ? "right-1 text-slate-400" : "left-1 text-slate-400"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Quick Suggestion Chips */}
          {messages.length <= 2 && !isLoading && (
            <div className="space-y-2 pt-2 animate-in fade-in duration-300">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Suggested Questions:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="text-xs bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-700 hover:text-[#00A79D] px-3 py-1.5 rounded-full font-medium shadow-2xs transition-all cursor-pointer text-left"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-end gap-2 md:gap-3">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white text-[#00A79D] flex items-center justify-center shrink-0 shadow-sm border border-slate-100"><Bot size={16} /></div>
              <div className="bg-white border border-slate-100 px-4 py-3 md:px-4 md:py-4 rounded-3xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* INPUT AREA */}
        <div className="bg-white p-3 md:p-5 border-t border-slate-100 shrink-0 z-50">
          <form onSubmit={handleSend} className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 border border-transparent hover:border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00A79D]/20 focus-within:border-[#00A79D] rounded-full px-1.5 py-1.5 transition-all duration-200 shadow-sm">
            <div className="pl-3 text-slate-400"><MessageCircle size={18} strokeWidth={2} /></div>
            <input
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                setTimeout(scrollToBottom, 300);
              }}
              placeholder="Ask anything about our services..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-sm md:text-[15px] h-10 md:h-11 font-medium px-2 min-w-0"
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading} className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${!input.trim() || isLoading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#00A79D] text-white hover:bg-teal-700 hover:scale-105 shadow-md cursor-pointer"}`}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" strokeWidth={2.5} />}
            </button>
          </form>
        </div>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        ref={toggleBtnRef}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-9990 group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] shadow-xl shadow-[#00A79D]/30 transition-all duration-500 bg-[#00A79D] hover:bg-teal-700 hover:-translate-y-1 cursor-pointer ${isOpen ? "scale-0 opacity-0 pointer-events-none rotate-90" : "scale-100 opacity-100 rotate-0"}`}
      >
        <MessageCircle className="text-white w-7 h-7 md:w-8 md:h-8 transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-[3px] border-white shadow-sm animate-bounce"></span>
      </button>
    </>
  );
}