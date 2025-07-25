import React from 'react';

type TabName = 'Daily Brief' | 'Wealth Hub' | 'Health Hub' | 'Career Hub' | 'Chat';

const tabs: { name: TabName; icon: string }[] = [
  { name: 'Daily Brief', icon: '🌅' },
  { name: 'Wealth Hub', icon: '💰' },
  { name: 'Health Hub', icon: '❤️' },
  { name: 'Career Hub', icon: '🎯' },
  { name: 'Chat', icon: '💬' },
];

export default function TopNav({ activeTab, setActiveTab }: { activeTab: TabName; setActiveTab: (tab: TabName) => void }) {
  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-white shadow-md border-b sticky top-0 z-20 rounded-t-2xl">
      <div className="flex items-center gap-6">
        <span className="font-extrabold text-2xl tracking-tight text-blue-700 flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-lg shadow">LifeOS</span>
        </span>
        <div className="flex gap-2 ml-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-base ${activeTab === tab.name ? 'bg-blue-100 text-blue-700 shadow' : 'hover:bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
      <button className="relative p-2 rounded-full hover:bg-blue-50 transition">
        <span className="text-2xl">🔔</span>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow">3</span>
      </button>
    </nav>
  );
} 