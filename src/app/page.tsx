"use client";
import React, { useState, JSX } from 'react';
import { motion } from 'framer-motion';
import TopNav from './components/TopNav';
import LayoutPanels from './components/LayoutPanels';
import ChatPanel from './components/ChatPanel';

type TabName = 'Daily Brief' | 'Wealth Hub' | 'Health Hub' | 'Career Hub' | 'Chat';

function AnimatedCounter({ value, prefix = '', suffix = '', className = '' }: { value: number; prefix?: string; suffix?: string; className?: string }) {
  const [display, setDisplay] = useState(0);
  React.useEffect(() => {
    let start = 0;
    const step = () => {
      if (start < value) {
        start += Math.ceil(value / 30);
        if (start > value) start = value;
        setDisplay(start);
        requestAnimationFrame(step);
      }
    };
    step();
  }, [value]);
  return <span className={className}>{prefix}{display.toLocaleString()}{suffix}</span>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.1 + i * 0.15, type: 'spring', stiffness: 80, damping: 12 },
  }),
};

const demoCards: Record<TabName, JSX.Element> = {
  'Daily Brief': (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-2">
      {/* Hero Greeting */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring', stiffness: 60 }} className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <span className="text-4xl">🌅</span>
          <span className="text-3xl font-extrabold text-blue-700 drop-shadow">Good morning, Sarah!</span>
        </div>
        <div className="text-lg text-gray-700 mt-2">Here's what I accomplished while you slept:</div>
      </motion.div>
      {/* Animated Divider */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5, type: 'spring' }} className="w-full max-w-2xl h-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-full mb-8 origin-left" />
      {/* Cards Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Wealth Section */}
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }} className="relative bg-gradient-to-br from-yellow-100/80 to-yellow-50/60 rounded-2xl p-6 flex flex-col gap-2 shadow-xl border border-yellow-200/60 backdrop-blur-md overflow-hidden min-h-[260px] group transition-all">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">💰</span>
            <span className="font-bold text-yellow-700 text-lg">Wealth Optimization</span>
            <span className="ml-auto bg-green-100/80 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
              +<AnimatedCounter value={487} prefix="$" />
            </span>
          </div>
          <ul className="text-base text-gray-700 space-y-1 mt-2">
            <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Negotiated Comcast bill <span className="ml-auto text-green-700 font-semibold">-$30/mo</span></li>
            <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Cancelled unused subscriptions <span className="ml-auto text-green-700 font-semibold">-$145/mo</span></li>
            <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Optimized savings account <span className="ml-auto text-green-700 font-semibold">+<AnimatedCounter value={45} prefix="$" />/mo</span></li>
          </ul>
          <button className="mt-4 text-xs text-blue-700 hover:underline font-semibold">View Details</button>
          <div className="absolute right-2 top-2 w-16 h-16 bg-green-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition" />
        </motion.div>
        {/* Health Section */}
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(255,0,80,0.10)' }} className="relative bg-gradient-to-br from-red-100/80 to-pink-50/60 rounded-2xl p-6 flex flex-col gap-2 shadow-xl border border-red-200/60 backdrop-blur-md overflow-hidden min-h-[260px] group transition-all">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">❤️</span>
            <span className="font-bold text-red-700 text-lg">Health Monitoring</span>
            <span className="ml-auto bg-red-100/80 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">1 Alert</span>
          </div>
          <ul className="text-base text-gray-700 space-y-1 mt-2">
            <li className="flex items-center gap-2"><span className="text-orange-500">⚠️</span> Sleep quality declining - intervention activated</li>
            <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Massage booked for 6 PM today</li>
          </ul>
          <button className="mt-4 text-xs text-red-700 hover:underline font-semibold">View Details</button>
          <div className="absolute left-2 bottom-2 w-16 h-16 bg-red-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition" />
        </motion.div>
        {/* Career Section */}
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(0,180,120,0.10)' }} className="relative bg-gradient-to-br from-green-100/80 to-teal-50/60 rounded-2xl p-6 flex flex-col gap-2 shadow-xl border border-green-200/60 backdrop-blur-md overflow-hidden min-h-[260px] group transition-all">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-green-700 text-lg">Career Advancement</span>
            <span className="ml-auto bg-blue-100/80 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">2 Opps</span>
          </div>
          <ul className="text-base text-gray-700 space-y-1 mt-2">
            <li className="flex items-center gap-2"><span className="text-blue-600">★</span> Google SDE role posted - <span className="font-semibold">94% match!</span></li>
            <li className="flex items-center gap-2"><span className="text-blue-600">★</span> AWS certification on sale - <span className="font-semibold">$100 off</span></li>
          </ul>
          <button className="mt-4 text-xs text-green-700 hover:underline font-semibold">View Details</button>
          <div className="absolute right-2 bottom-2 w-16 h-16 bg-blue-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition" />
        </motion.div>
      </div>
      {/* Floating Action Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 flex gap-4 bg-white/80 backdrop-blur-lg rounded-full shadow-lg px-6 py-3 border border-gray-200">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition text-sm">Play Audio Briefing</button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold shadow hover:bg-purple-600 transition text-sm">Share Win</button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition text-sm">Approve All</button>
      </motion.div>
    </div>
  ),
  'Wealth Hub': (
    <div className="bg-yellow-50 rounded-xl p-8 shadow text-gray-800 flex flex-col gap-4">
      <div className="text-2xl font-bold mb-2">💰 Wealth Dashboard</div>
      <div className="text-lg">Monthly Impact: <span className="font-bold text-green-600">+$1,847</span></div>
      <ul className="list-disc ml-6 text-base">
        <li>Pending Approvals: Switch to Ally Savings - Save $67/mo</li>
        <li>Autonomous Actions: Comcast bill negotiated, Adobe subscription cancelled</li>
        <li>Generated Resources: Tax_Optimization_Guide_2024.pdf</li>
      </ul>
    </div>
  ),
  'Health Hub': (
    <div className="bg-red-50 rounded-xl p-8 shadow text-gray-800 flex flex-col gap-4">
      <div className="text-2xl font-bold mb-2">❤️ Health Dashboard</div>
      <div className="text-lg">Vital Metrics: Sleep Score 72/100, Stress Elevated</div>
      <ul className="list-disc ml-6 text-base">
        <li>Active Interventions: Burnout risk detected, Massage booked</li>
        <li>Recommendations: Start Vitamin D, Schedule checkup</li>
      </ul>
    </div>
  ),
  'Career Hub': (
    <div className="bg-green-50 rounded-xl p-8 shadow text-gray-800 flex flex-col gap-4">
      <div className="text-2xl font-bold mb-2">🎯 Career Dashboard</div>
      <div className="text-lg">Opportunity Radar: Google SDE - 94% match!</div>
      <ul className="list-disc ml-6 text-base">
        <li>Active Applications: Amazon SDE III, Meta E5</li>
        <li>Skill Development: AWS Certification, System Design course</li>
      </ul>
    </div>
  ),
  'Chat': (
    <ChatPanel />
  ),
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabName>('Daily Brief');
  const [rightPanelVisible, setRightPanelVisible] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <LayoutPanels rightPanelVisible={rightPanelVisible} setActiveTab={setActiveTab}>
        {demoCards[activeTab]}
      </LayoutPanels>
    </div>
  );
}
