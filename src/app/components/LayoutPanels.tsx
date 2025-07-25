import React from 'react';

type TabName = 'Daily Brief' | 'Wealth Hub' | 'Health Hub' | 'Career Hub' | 'Chat';

export default function LayoutPanels({ children, rightPanelVisible, setActiveTab }: { children: React.ReactNode; rightPanelVisible: boolean; setActiveTab: (tab: TabName) => void }) {
  return (
    <div className="flex flex-row h-[calc(100vh-72px)] bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Left Panel */}
      <aside className="w-[250px] bg-white border-r flex flex-col p-4 shadow-md rounded-tr-2xl rounded-br-2xl mt-4 ml-4 mb-4">
        <button className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition" onClick={() => setActiveTab('Chat')}>+ New Chat</button>
        <div className="flex-1 overflow-y-auto space-y-2">
          <div className="font-bold text-gray-700 mb-2">Chat List</div>
          <div className="bg-gray-100 rounded-lg p-2">(placeholder)</div>
        </div>
        <div className="mt-6">
          <input className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Search..." />
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          {['All', 'Wealth', 'Health', 'Career'].map((cat) => (
            <span key={cat} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold cursor-pointer hover:bg-blue-200 transition">{cat}</span>
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