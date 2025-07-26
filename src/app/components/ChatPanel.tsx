"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "ai";
  text: string;
  sessionId?: string;
  type?: 'simple' | 'interview_prep';
  progress?: string[];
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user" as const, text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);
    setError(null);
    setIsProcessing(true);
    
    try {
      // Create a timeout for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
      
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.response) {
        // If this is an interview prep request, show progress updates
        if (data.type === 'interview_prep' && data.progress) {
          // Show acknowledgment first
          const acknowledgmentMessage: Message = { 
            role: "ai", 
            text: "Working on your request...",
            type: 'interview_prep'
          };
          setMessages((msgs) => [...msgs, acknowledgmentMessage]);
          
          // Show progress updates as separate messages
          for (let i = 1; i < data.progress.length; i++) {
            const progressMessage: Message = { 
              role: "ai", 
              text: data.progress[i],
              type: 'interview_prep'
            };
            setMessages((msgs) => [...msgs, progressMessage]);
            
            // Add small delay between progress updates
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          // Show final summary
          const summaryMessage: Message = { 
            role: "ai", 
            text: data.response,
            type: 'interview_prep'
          };
          setMessages((msgs) => [...msgs, summaryMessage]);
        } else {
          // Regular chat response
          const aiMessage: Message = { 
            role: "ai", 
            text: data.response,
            type: data.type,
            sessionId: data.sessionId
          };
          setMessages((msgs) => [...msgs, aiMessage]);
        }
        
        // Show error message if there was a fallback
        if (data.error) {
          setError(`Note: ${data.error}`);
        }
      } else {
        setError(data.error || "No response from AI");
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.message || "Network error");
      }
    } finally {
      setLoading(false);
      setIsProcessing(false);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  return (
    <div className="flex flex-col h-full bg-white/80 rounded-2xl shadow-xl p-4">
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-12">
            Start chatting with your AI agent...
            <br />
            <span className="text-sm">Try asking: "I have an interview next month with Amazon for Senior Backend role"</span>
          </div>
        )}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[70%] shadow text-base whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-2xl"
                  : msg.type === 'interview_prep' && msg.text.includes('Working on your request')
                  ? "bg-gray-100 text-gray-900 rounded-bl-2xl border border-gray-200"
                  : msg.type === 'interview_prep' && msg.text.includes('✅') || msg.text.includes('🎉')
                  ? "bg-green-100 text-green-900 rounded-bl-2xl border border-green-200"
                  : msg.type === 'interview_prep'
                  ? "bg-blue-100 text-blue-900 rounded-bl-2xl border border-blue-200"
                  : "bg-gray-100 text-gray-900 rounded-bl-2xl border border-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="text-orange-500 text-sm mb-2 text-center bg-orange-50 p-2 rounded">
          {error}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v4m0 8v4m8-8h-4M4 12H0" />
              </svg>
            </motion.span>
          ) : (
            <span>Send</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatPanel; 