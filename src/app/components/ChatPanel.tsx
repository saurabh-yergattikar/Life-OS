"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface Message {
  role: "user" | "ai";
  text: string;
  sessionId?: string;
  type?: 'simple' | 'interview_prep' | 'emergency_crisis';
  progress?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// Simple markdown renderer for bold text and bullet points
const renderMarkdown = (text: string) => {
  // Convert **text** to <strong>text</strong>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Split into lines to handle indentation properly
  const lines = formattedText.split('\n');
  const processedLines = lines.map(line => {
    // Check if this is a main bullet point (starts with - and no leading spaces)
    if (line.trim().startsWith('-') && !line.startsWith(' ')) {
      return line.replace(/^\s*-\s*/, '• ');
    }
    
    // Check if this is a sub-bullet point (starts with - and has leading spaces)
    if (line.trim().startsWith('-') && line.startsWith(' ')) {
      return line.replace(/^\s*-\s*/, '       ◦ ');
    }
    
    // Check if this is a main bullet point with *
    if (line.trim().startsWith('*') && !line.startsWith(' ')) {
      return line.replace(/^\s*\*\s*/, '• ');
    }
    
    // Check if this is a sub-bullet point with *
    if (line.trim().startsWith('*') && line.startsWith(' ')) {
      return line.replace(/^\s*\*\s*/, '       ◦ ');
    }
    
    // Check if this is already a bullet point
    if (line.trim().startsWith('•') && !line.startsWith(' ')) {
      return line;
    }
    
    // Check if this is already a sub-bullet point
    if (line.trim().startsWith('•') && line.startsWith(' ')) {
      return line.replace(/^\s*•\s*/, '       ◦ ');
    }
    
    return line;
  });
  
  return processedLines.join('\n');
};

// Helper functions for localStorage
const CHAT_HISTORY_KEY = 'life_os_chat_history';
const CURRENT_SESSION_KEY = 'life_os_current_session';

const saveChatHistory = (sessions: ChatSession[]) => {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

const loadChatHistory = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

const saveCurrentSession = (sessionId: string | null) => {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId || '');
  } catch (error) {
    console.error('Error saving current session:', error);
  }
};

const loadCurrentSession = (): string | null => {
  try {
    const stored = localStorage.getItem(CURRENT_SESSION_KEY);
    return stored || null;
  } catch (error) {
    console.error('Error loading current session:', error);
    return null;
  }
};

const generateSessionTitle = (firstMessage: string): string => {
  // Extract a meaningful title from the first user message
  const words = firstMessage.split(' ').slice(0, 6);
  return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
};

interface ChatPanelProps {
  onSessionChange?: (sessions: ChatSession[], currentSessionId: string | null) => void;
  currentSessionId?: string | null;
  sessions?: ChatSession[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  onSessionChange, 
  currentSessionId: externalCurrentSessionId,
  sessions: externalSessions 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Internal state for when no external props are provided
  const [internalSessions, setInternalSessions] = useState<ChatSession[]>([]);
  const [internalCurrentSessionId, setInternalCurrentSessionId] = useState<string | null>(null);

  // Use external or internal state
  const sessions = externalSessions || internalSessions;
  const currentSessionId = externalCurrentSessionId !== undefined ? externalCurrentSessionId : internalCurrentSessionId;
  const setSessions = externalSessions ? (() => {}) : setInternalSessions;
  const setCurrentSessionId = externalCurrentSessionId !== undefined ? (() => {}) : setInternalCurrentSessionId;

  // Load chat history on mount
  useEffect(() => {
    if (!externalSessions) {
      const history = loadChatHistory();
      setInternalSessions(history);
      
      const currentSession = loadCurrentSession();
      if (currentSession && history.find(s => s.id === currentSession)) {
        setInternalCurrentSessionId(currentSession);
        const session = history.find(s => s.id === currentSession);
        if (session) {
          setMessages(session.messages);
        }
      } else {
        // Start a new session if no current session or session not found
        startNewChat();
      }
    }
  }, [externalSessions]);

  // Update messages when current session changes
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) {
        setMessages(session.messages);
      } else {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [currentSessionId, sessions]);

  // Save sessions when they change
  useEffect(() => {
    if (!externalSessions) {
      saveChatHistory(sessions);
      saveCurrentSession(currentSessionId);
    }
    if (onSessionChange) {
      onSessionChange(sessions, currentSessionId);
    }
  }, [sessions, currentSessionId, externalSessions, onSessionChange]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNewChat = () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const updatedSessions = [newSession, ...sessions];
    
    // Update internal sessions if not using external sessions
    if (!externalSessions) {
      setSessions(updatedSessions);
    }
    
    // Always call onSessionChange to update parent state
    if (onSessionChange) {
      onSessionChange(updatedSessions, newSessionId);
    }
    
    setCurrentSessionId(newSessionId);
    setMessages([]);
  };

  const loadSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    
    // Call onSessionChange to update parent state
    if (onSessionChange) {
      onSessionChange(sessions, sessionId);
    }
  };

  const updateSessionMessages = (sessionId: string, newMessages: Message[]) => {
    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: newMessages,
          updatedAt: Date.now(),
          title: session.title === 'New Chat' && newMessages.length > 0 
            ? generateSessionTitle(newMessages[0].text)
            : session.title
        };
      }
      return session;
    });
    
    // Update internal sessions if not using external sessions
    if (!externalSessions) {
      setSessions(updatedSessions);
    }
    
    // Always call onSessionChange to update parent state
    if (onSessionChange) {
      onSessionChange(updatedSessions, currentSessionId);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentSessionId) return;
    
    const userMessage = { role: "user" as const, text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    updateSessionMessages(currentSessionId, newMessages);
    
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
        let updatedMessages = [...newMessages];
        
        // If this is an interview prep request, show progress updates
        if (data.type === 'interview_prep' && data.progress) {
          // Show acknowledgment first
          const acknowledgmentMessage: Message = { 
            role: "ai", 
            text: "Working on your request...",
            type: 'interview_prep'
          };
          updatedMessages = [...updatedMessages, acknowledgmentMessage];
          setMessages(updatedMessages);
          updateSessionMessages(currentSessionId, updatedMessages);
          
          // Show progress updates as separate messages
          for (let i = 1; i < data.progress.length; i++) {
            const progressMessage: Message = { 
              role: "ai", 
              text: data.progress[i],
              type: 'interview_prep'
            };
            updatedMessages = [...updatedMessages, progressMessage];
            setMessages(updatedMessages);
            updateSessionMessages(currentSessionId, updatedMessages);
            
            // Add small delay between progress updates
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          // Show final summary
          const summaryMessage: Message = { 
            role: "ai", 
            text: data.response,
            type: 'interview_prep'
          };
          updatedMessages = [...updatedMessages, summaryMessage];
          setMessages(updatedMessages);
          updateSessionMessages(currentSessionId, updatedMessages);
        } else {
          // Regular chat response
          const aiMessage: Message = { 
            role: "ai", 
            text: data.response,
            type: data.type,
            sessionId: data.sessionId
          };
          updatedMessages = [...updatedMessages, aiMessage];
          setMessages(updatedMessages);
          updateSessionMessages(currentSessionId, updatedMessages);
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
                  : msg.type === 'interview_prep' && (msg.text.includes('✅') || msg.text.includes('🎉'))
                  ? "bg-green-100 text-green-900 rounded-bl-2xl border border-green-200"
                  : msg.type === 'interview_prep'
                  ? "bg-blue-100 text-blue-900 rounded-bl-2xl border border-blue-200"
                  : msg.type === 'emergency_crisis' && msg.text.includes('🚨')
                  ? "bg-red-100 text-red-900 rounded-bl-2xl border border-red-200"
                  : msg.type === 'emergency_crisis' && (msg.text.includes('✅') || msg.text.includes('🎉'))
                  ? "bg-green-100 text-green-900 rounded-bl-2xl border border-green-200"
                  : msg.type === 'emergency_crisis'
                  ? "bg-orange-100 text-orange-900 rounded-bl-2xl border border-orange-200"
                  : "bg-gray-100 text-gray-900 rounded-bl-2xl border border-gray-200"
              }`}
            >
              {msg.role === "ai" ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(msg.text)
                  }}
                  className="prose prose-sm max-w-none"
                />
              ) : (
                msg.text
              )}
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