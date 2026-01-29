"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
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
const API_BASE = "https://telegram-chatbot-gmq4.onrender.com/api/chat";

// --- API UTILITY ---
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const fetchOptions = {
      ...options,
      mode: 'cors' as RequestMode,
      credentials: 'omit' as RequestCredentials,
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
}

// --- COMPONENT ---
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState<ChatState>("init");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  // --- CLICK OUTSIDE HANDLER (For Dropdown) ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- POLLING LOGIC ---
  const fetchMessages = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, ok } = await apiCall(`/messages/${userId}`, {
        method: "GET",
      });
      
      if (!ok) return;

      const messagesList = data?.messages || data?.data?.messages || [];
      
      if (Array.isArray(messagesList)) {
        const serverMessages: Message[] = messagesList.map((msg: ServerMessage) => {
          let role: "user" | "bot" = "bot";
          if (msg.sender === "user" || msg.role === "user" || msg.from === "user") {
            role = "user";
          } else if (["owner", "bot", "admin", "assistant"].includes(msg.sender || "")) {
            role = "bot";
          }
          
          return {
            id: msg._id || msg.id || `msg-${msg.timestamp || Date.now()}-${Math.random()}`,
            role: role,
            content: msg.text || msg.content || msg.message || "",
            timestamp: new Date(msg.timestamp || msg.createdAt || Date.now()),
          };
        }).filter(msg => msg.content); 

        setMessages((prevMessages) => {
          const systemMessages = prevMessages.filter(m => 
            (m.content.includes("What's your name") || 
             m.content.includes("Nice to meet you") ||
             m.content.includes("assist you") ||
             m.content.includes("Welcome back")) &&
            m.role === "bot"
          );
          
          const existingContentMap = new Map(
            prevMessages.map(m => [m.content.trim().toLowerCase(), m])
          );
          
          const filteredServer = serverMessages.filter(sm => !existingContentMap.has(sm.content.trim().toLowerCase()));
          
          if (filteredServer.length > 0) {
            const merged = [...systemMessages, ...serverMessages];
            return merged.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          }
          return prevMessages;
        });
      }
    } catch (error) {
      console.error("❌ Fetch messages error:", error);
    }
  }, [userId]);

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 3000);
  }, [fetchMessages]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // --- INITIALIZATION ---
  const initChat = useCallback(async () => {
    try {
      setIsLoading(true);
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const { response, data, ok } = await apiCall('/init', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: newSessionId }),
      });

      if (!ok) throw new Error(`Init failed with status ${response.status}`);

      if (data?.success) {
        setSessionId(newSessionId);
        setChatState("name_verification");
        const welcomeMessage = data?.message || "Hey there! 👋 Welcome to Client Support. What's your name?";
        
        setMessages([{
          id: Date.now().toString(),
          role: "bot",
          content: welcomeMessage,
          timestamp: new Date(),
        }]);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setMessages([{
        id: Date.now().toString(),
        role: "bot",
        content: `Sorry, I'm having trouble connecting. Error: ${msg}.`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- EFFECTS ---
  
  // 1. Manage Body Scroll and Initial Scroll
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure rendering is complete before scrolling
      setTimeout(scrollToBottom, 100);
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden'; 
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, scrollToBottom]);

  // 2. Scroll on New Messages
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom, isLoading]);

  // 3. Handle Mobile Keyboard / Resize
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
        // When viewport height changes (keyboard opens), scroll to bottom
        setTimeout(scrollToBottom, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, scrollToBottom]);

  // 4. Init Chat Logic
  useEffect(() => {
    if (isOpen && chatState === "init" && !initRef.current) {
      initRef.current = true;
      initChat();
    }
  }, [isOpen, chatState, initChat]);

  // 5. Polling Logic
  useEffect(() => {
    if (chatState === "chatting" && userId) {
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [chatState, userId, startPolling, stopPolling]);

  // --- ACTIONS ---
  const verifyName = async (name: string) => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const { data, ok } = await apiCall('/verify-name', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, name }),
      });

      if (!ok) throw new Error("Verification failed");

      if (data?.success || data?.verified) {
        setUserName(name);
        const extractedUserId = data?.userId || data?.user_id || sessionId;
        setUserId(extractedUserId);
        setChatState("chatting");
        
        setMessages((prev) => [
          ...prev, 
          {
            id: `bot-greet-${Date.now()}`,
            role: "bot",
            content: data?.message || `Nice to meet you, ${name}!`,
            timestamp: new Date(),
          },
          {
            id: `bot-ask-${Date.now() + 1}`,
            role: "bot",
            content: "How can I assist you today?",
            timestamp: new Date(Date.now() + 100),
          }
        ]);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error';
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "bot",
        content: `Sorry, something went wrong: ${msg}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!userId) return;
    try {
      const { data, ok } = await apiCall('/send', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: messageText }),
      });

      if (!ok || !data?.success) throw new Error("Failed to send message");
      setTimeout(fetchMessages, 1000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error';
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "bot",
        content: `Sorry, I couldn't send your message: ${msg}`,
        timestamp: new Date(),
      }]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageText = input.trim();
    
    setMessages((prev) => [...prev, {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }]);
    
    setInput("");
    setIsLoading(true);

    if (chatState === "name_verification") {
      await verifyName(messageText);
    } else if (chatState === "chatting") {
      await sendMessage(messageText);
    }
    setIsLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  const handleManualRefresh = () => {
    if (chatState === "chatting") {
      setIsLoading(true);
      fetchMessages().finally(() => setIsLoading(false));
    }
  };

  const clearChat = () => {
    stopPolling();
    initRef.current = false;
    setMessages([]);
    setChatState("init");
    setSessionId(null);
    setUserId(null);
    setUserName("");
    setIsDropdownOpen(false);
    
    if (isOpen) {
        setTimeout(() => {
            initChat();
        }, 300);
    }
  };

  const temporaryClose = () => {
    setIsDropdownOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      <div 
        className={`
          fixed z-9999 flex flex-col overflow-hidden bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 ring-1 ring-black/5 transition-all duration-300 ease-in-out
          ${isOpen 
            ? "opacity-100 pointer-events-auto translate-y-0 scale-100" 
            : "opacity-0 pointer-events-none translate-y-10 scale-95"
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
                  {chatState === "chatting" && userName ? `Chatting as ${userName}` : "Always Active"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-1 relative z-10 items-center">
            <button 
              onClick={handleManualRefresh} 
              className={`text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 ${isLoading ? 'animate-spin' : ''}`} 
              title="Check for new messages"
            >
              <RefreshCw size={18} />
            </button>

            <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
                >
                  <MoreVertical size={20} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={clearChat}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-b border-slate-50"
                    >
                      <Trash2 size={16} />
                      Clear Chat
                    </button>
                    <button 
                      onClick={temporaryClose}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <Minimize2 size={16} />
                      Minimize
                    </button>
                  </div>
                )}
            </div>

            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 md:hidden">
              <ChevronDown size={24} />
            </button>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 md:space-y-6 bg-slate-50 scroll-smooth min-h-0 overscroll-contain">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 md:gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} group`}>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-black/5 ${msg.role === "user" ? "bg-gray-900 text-white" : "bg-white text-[#00A79D]"}`}>
                {msg.role === "user" ? <User size={14} strokeWidth={2.5} /> : <Bot size={16} strokeWidth={2.5} />}
              </div>
              <div className={`
                  max-w-[85%] md:max-w-[80%] 
                  px-4 py-3 md:px-5 md:py-3.5 
                  shadow-sm text-[14px] md:text-[15px] leading-relaxed 
                  relative transition-all duration-200 wrap-break-word whitespace-pre-wrap
                  ${msg.role === "user" 
                    ? "bg-[#00A79D] text-white rounded-3xl rounded-tr-sm" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-3xl rounded-tl-sm"
                  }
              `}>
                <p>{msg.content}</p>
                <span className={`text-[10px] font-medium absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${msg.role === "user" ? "right-1 text-slate-400" : "left-1 text-slate-400"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

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
            <div className="pl-3 text-slate-400"><Sparkles size={18} strokeWidth={2} /></div>
            <input
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                // Scroll to bottom when keyboard opens
                setTimeout(scrollToBottom, 300);
              }}
              placeholder={chatState === "name_verification" ? "Enter your name..." : "Ask anything..."}
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-sm md:text-[15px] h-10 md:h-11 font-medium px-2 min-w-0"
              disabled={isLoading || chatState === "init"}
            />
            <button type="submit" disabled={!input.trim() || isLoading || chatState === "init"} className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${!input.trim() || isLoading || chatState === "init" ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#00A79D] text-white hover:bg-teal-700 hover:scale-105 shadow-md"}`}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" strokeWidth={2.5} />}
            </button>
          </form>
        </div>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-9990 group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] shadow-xl shadow-[#00A79D]/30 transition-all duration-500 bg-[#00A79D] hover:bg-teal-700 hover:-translate-y-1 ${isOpen ? "scale-0 opacity-0 pointer-events-none rotate-90" : "scale-100 opacity-100 rotate-0"}`}
      >
        <MessageCircle className="text-white w-7 h-7 md:w-8 md:h-8 transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-[3px] border-white shadow-sm animate-bounce"></span>
      </button>
    </>
  );
}