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

type ChatState = "init" | "name_verification" | "chatting";

const API_BASE = "https://telegram-chatbot-gmq4.onrender.com/api/chat";

// Utility function to make API calls with detailed logging
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body as string) : '');
  
  try {
    // Add CORS mode and credentials
    const fetchOptions = {
      ...options,
      mode: 'cors' as RequestMode,
      credentials: 'omit' as RequestCredentials,
    };
    
    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    console.log(`📥 Response [${response.status}]:`, data);
    
    return { response, data, ok: response.ok };
  } catch (error) {
    console.error(`❌ API Error:`, error);
    throw error;
  }
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState<ChatState>("init");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Add userId for sending messages
  const [userName, setUserName] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
  }, [messages, isLoading, isOpen]);

  // Initialize chat session when widget opens
  useEffect(() => {
    if (isOpen && chatState === "init") {
      initChat();
    }
  }, [isOpen]);

  // Start polling for messages when chatting
  useEffect(() => {
    if (chatState === "chatting" && userId) {
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [chatState, userId]);

  const initChat = async () => {
    try {
      setIsLoading(true);
      
      // Generate a unique sessionId (can use timestamp + random string)
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      console.log("🆔 Generated sessionId:", newSessionId);
      
      // Try the init endpoint with sessionId
      const { response, data, ok } = await apiCall('/init', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: newSessionId }),
      });

      if (!ok) {
        throw new Error(`Init failed with status ${response.status}: ${JSON.stringify(data)}`);
      }

      // Use the sessionId from the request as our identifier
      if (data?.success) {
        console.log("✅ Session initialized with ID:", newSessionId);
        setSessionId(newSessionId);
        setChatState("name_verification");
        
        // Use the message from backend if available
        const welcomeMessage = data?.message || "Hey there! 👋 Welcome to YF Advisors. What's your name?";
        
        setMessages([{
          id: Date.now().toString(),
          role: "bot",
          content: welcomeMessage,
          timestamp: new Date(),
        }]);
      } else {
        throw new Error("Invalid response: initialization failed");
      }
    } catch (error: any) {
      console.error("❌ Init error:", error);
      setMessages([{
        id: Date.now().toString(),
        role: "bot",
        content: `Sorry, I'm having trouble connecting. Error: ${error.message || 'Unknown error'}. Please check console for details.`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyName = async (name: string) => {
    if (!sessionId) return;

    try {
      setIsLoading(true);
      const { response, data, ok } = await apiCall('/verify-name', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, name }),
      });

      if (!ok) {
        throw new Error(`Verify name failed: ${JSON.stringify(data)}`);
      }

      if (data?.success || data?.verified) {
        setUserName(name);
        
        // Extract userId from response for sending messages
        const extractedUserId = data?.userId || data?.user_id || sessionId;
        setUserId(extractedUserId);
        console.log("✅ User ID for messages:", extractedUserId);
        
        setChatState("chatting");
        
        // Use backend message if available
        const welcomeMsg = data?.message || `Great to meet you, ${name}! 🎉 Ask me anything about audits, payroll, or financial consulting. Our team will respond to you shortly!`;
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: welcomeMsg,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error: any) {
      console.error("❌ Name verification error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: `Sorry, something went wrong: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!userId) {
      console.error("❌ No userId available for sending message");
      return;
    }

    try {
      const { data, ok } = await apiCall('/send', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId, // Use userId instead of sessionId for sending messages
          message: messageText 
        }),
      });

      if (!ok || !data?.success) {
        throw new Error("Failed to send message");
      }
      
      console.log("✅ Message sent successfully");
      
      // Immediately fetch messages to get any quick replies
      setTimeout(() => {
        fetchMessages();
      }, 1000);
      
    } catch (error: any) {
      console.error("❌ Send message error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: `Sorry, I couldn't send your message: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const fetchMessages = async () => {
    if (!userId) return;

    try {
      const { data, ok } = await apiCall(`/messages/${userId}`, {
        method: "GET",
      });
      
      if (!ok) {
        console.error("Failed to fetch messages");
        return;
      }

      const messagesList = data?.messages || data?.data?.messages || [];
      
      if (Array.isArray(messagesList)) {
        console.log(`📦 Fetched ${messagesList.length} total messages from server`);
        
        // Log first message to see structure
        if (messagesList.length > 0) {
          console.log("📋 Sample message structure:", JSON.stringify(messagesList[0], null, 2));
        }
        
        // Format all messages from server
        const serverMessages: Message[] = messagesList.map((msg: any, index: number) => {
          // Determine role - check multiple fields
          let role: "user" | "bot" = "bot";
          
          // If sender is explicitly "user" or message is from user
          if (msg.sender === "user" || msg.role === "user" || msg.from === "user") {
            role = "user";
          }
          // If sender is "owner" or "bot" or "admin", it's a bot message
          else if (msg.sender === "owner" || msg.sender === "bot" || msg.sender === "admin" || msg.sender === "assistant") {
            role = "bot";
          }
          
          console.log(`Message ${index}: sender="${msg.sender}", role="${role}", content="${msg.text || msg.content || msg.message}"`);
          
          return {
            id: msg._id || msg.id || `msg-${msg.timestamp || Date.now()}-${Math.random()}`,
            role: role,
            content: msg.text || msg.content || msg.message || "",
            timestamp: new Date(msg.timestamp || msg.createdAt || Date.now()),
          };
        }).filter(msg => msg.content); // Only include messages with content

        // Update messages state
        setMessages((prevMessages) => {
          // Keep system messages (greeting and welcome messages)
          const systemMessages = prevMessages.filter(m => 
            (m.content.includes("What's your name") || 
             m.content.includes("Nice to meet you") ||
             m.content.includes("Welcome back")) &&
            m.role === "bot"
          );
          
          // Create a map of existing message IDs
          const existingContentMap = new Map(
            prevMessages.map(m => [m.content.trim().toLowerCase(), m])
          );
          
          // Get unique messages from server
          const newServerMessages = serverMessages.filter(serverMsg => {
            const contentKey = serverMsg.content.trim().toLowerCase();
            // Don't add if exact same content exists
            return !existingContentMap.has(contentKey);
          });
          
          // If we have new messages, add them
          if (newServerMessages.length > 0) {
            console.log(`📨 ${newServerMessages.length} new message(s) added to chat`);
            console.log("New messages:", newServerMessages.map(m => `${m.role}: ${m.content}`));
            
            // Combine system messages with all server messages, then sort
            const allMessages = [...systemMessages, ...serverMessages].sort(
              (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
            );
            
            return allMessages;
          }
          
          return prevMessages;
        });
      }
    } catch (error) {
      console.error("❌ Fetch messages error:", error);
    }
  };

  const startPolling = () => {
    if (pollingIntervalRef.current) return;
    
    // Poll every 3 seconds for new messages
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 3000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageText = input.trim();
    const userMessage: Message = {
      id: `user-${Date.now()}`, // Add prefix to avoid ID conflicts
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (chatState === "name_verification") {
        await verifyName(messageText);
      } else if (chatState === "chatting") {
        await sendMessage(messageText);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    stopPolling();
    setMessages([]);
    setChatState("init");
    setSessionId(null);
    setUserId(null);
    setUserName("");
    if (isOpen) {
      initChat();
    }
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
                <p className="text-teal-50 text-xs font-medium opacity-90">
                  {chatState === "chatting" && userName ? `Chatting as ${userName}` : "Always Active"}
                </p>
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
              placeholder={chatState === "name_verification" ? "Enter your name..." : "Ask anything..."}
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-sm md:text-[15px] h-11 font-medium px-2"
              disabled={isLoading || chatState === "init"}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading || chatState === "init"} 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                ${!input.trim() || isLoading || chatState === "init"
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
                Powered by YF AI {sessionId && `• Session: ${sessionId.slice(0, 20)}...`}
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