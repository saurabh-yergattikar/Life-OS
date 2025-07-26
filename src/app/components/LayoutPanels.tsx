"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Message, ChatSession } from './ChatPanel';

type TabName = 'Daily Brief' | 'Wealth Hub' | 'Health Hub' | 'Career Hub' | 'Chat';

export default function LayoutPanels({ 
  children, 
  rightPanelVisible, 
  setActiveTab,
  chatSessions = [],
  currentChatSessionId = null,
  onChatSessionChange = () => {},
  onNewChat = () => {},
  onLoadChatSession = () => {}
}: { 
  children: React.ReactNode; 
  rightPanelVisible: boolean; 
  setActiveTab: (tab: TabName) => void;
  chatSessions?: ChatSession[];
  currentChatSessionId?: string | null;
  onChatSessionChange?: (sessions: ChatSession[], currentSessionId: string | null) => void;
  onNewChat?: () => void;
  onLoadChatSession?: (sessionId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSessions = chatSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
      session.title.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSessionPreview = (session: ChatSession) => {
    const lastMessage = session.messages[session.messages.length - 1];
    if (!lastMessage) return 'No messages yet';
    
    const preview = lastMessage.text.substring(0, 50);
    return preview + (lastMessage.text.length > 50 ? '...' : '');
  };

  return (
    <div className="flex flex-row h-[calc(100vh-72px)] bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Left Panel */}
      <aside className="w-[250px] bg-white border-r flex flex-col p-4 shadow-md rounded-tr-2xl rounded-br-2xl mt-4 ml-4 mb-4">
        <button 
          className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition" 
          onClick={() => {
            setActiveTab('Chat');
            onNewChat();
          }}
        >
          + New Chat
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          <div className="font-bold text-gray-700 mb-2">Chat List</div>
          
          {filteredSessions.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">
              {searchTerm || selectedCategory !== 'All' ? 'No chats found' : 'No chats yet'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                    currentChatSessionId === session.id 
                      ? 'bg-blue-100 border border-blue-200' 
                      : 'bg-gray-50 hover:bg-blue-50'
                  }`}
                  onClick={() => {
                    setActiveTab('Chat');
                    onLoadChatSession(session.id);
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-gray-800 text-sm truncate flex-1">
                      {session.title}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(session.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    {getSessionPreview(session)}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-gray-400">
                      {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                    </span>
                    {session.messages.some(m => m.type === 'interview_prep') && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        Interview
                      </span>
                    )}
                    {session.messages.some(m => m.type === 'emergency_crisis') && (
                      <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                        Emergency
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <input 
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            placeholder="Search chats..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mt-4 flex gap-2 flex-wrap">
          {['All', 'Wealth', 'Health', 'Career'].map((cat) => (
            <span 
              key={cat} 
              className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                selectedCategory === cat 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </span>
          ))}
        </div>
      </aside>
      
      {/* Center Panel */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        {children}
      </main>
      
      {/* Right Panel (Agent Activity) */}
      {rightPanelVisible && (
        <aside className="w-[320px] bg-white border-l flex flex-col p-6 shadow-md rounded-tl-2xl rounded-bl-2xl mt-4 mr-4 mb-4 animate-fade-in">
          <div className="font-bold text-lg mb-4 text-blue-700">Agent Activity</div>
          <div className="bg-blue-50 rounded-lg p-4 mb-2 shadow">Active Agents (placeholder)</div>
          <div className="bg-blue-100 rounded-lg p-2 mb-2">Progress Bars (placeholder)</div>
          <div className="bg-gray-100 rounded-lg p-2">Logs (placeholder)</div>
        </aside>
      )}
    </div>
  );
} 