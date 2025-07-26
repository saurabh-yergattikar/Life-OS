"use client";
import React, { useState, useEffect, JSX } from 'react';
import { motion } from 'framer-motion';
import TopNav from './components/TopNav';
import LayoutPanels from './components/LayoutPanels';
import ChatPanel, { Message, ChatSession } from './components/ChatPanel';
import { getNightAgentResults } from './api';

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

// Dynamic Daily Brief component that fetches real Night Agent data
function DailyBriefContent({ setActiveTab }: { setActiveTab: (tab: TabName) => void }) {
  const [nightAgentData, setNightAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNightAgentData = async () => {
      try {
        const data = await getNightAgentResults();
        setNightAgentData(data);
      } catch (error) {
        console.error('Error fetching Night Agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNightAgentData();
  }, []);

  // Extract data from Night Agent results
  const wealthSavings = nightAgentData?.summary?.moneySaved || nightAgentData?.totalSavings || 0;
  const annualSavings = (nightAgentData?.summary?.moneySavedAnnually || wealthSavings * 12);
  
  // Get wealth achievements from details or alerts
  const wealthAchievements = nightAgentData?.details?.wealth || 
    nightAgentData?.alerts?.filter((alert: any) => 
      alert.message?.toLowerCase().includes('bill') || 
      alert.message?.toLowerCase().includes('subscription') ||
      alert.message?.toLowerCase().includes('saved') ||
      alert.message?.toLowerCase().includes('comcast') ||
      alert.message?.toLowerCase().includes('spotify')
    ) || [];

  // Get health alerts from details or alerts
  const healthAlerts = nightAgentData?.details?.health || 
    nightAgentData?.alerts?.filter((alert: any) => 
      alert.message?.toLowerCase().includes('sleep') || 
      alert.message?.toLowerCase().includes('massage') ||
      alert.message?.toLowerCase().includes('wellness') ||
      alert.message?.toLowerCase().includes('health')
    ) || [];

  // Get career opportunities from details or alerts
  const careerOpportunities = nightAgentData?.details?.career || 
    nightAgentData?.alerts?.filter((alert: any) => 
      alert.message?.toLowerCase().includes('job') || 
      alert.message?.toLowerCase().includes('career') ||
      alert.message?.toLowerCase().includes('opportunity') ||
      alert.message?.toLowerCase().includes('interview') ||
      alert.message?.toLowerCase().includes('google')
    ) || [];

  if (loading) {
    return (
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-2">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading your morning briefing...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-2">
      {/* Hero Greeting */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring', stiffness: 60 }} className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <span className="text-4xl">🌅</span>
          <span className="text-3xl font-extrabold text-blue-700 drop-shadow">Good morning, James!</span>
        </div>
        <div className="text-lg text-gray-700 mt-2">
          {nightAgentData ? 
            `Here's what your Kairo Night Agent accomplished while you slept:` :
            `Your Night Agent is ready to optimize your life while you sleep`
          }
        </div>
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
              +<AnimatedCounter value={annualSavings} prefix="$" suffix="/yr" />
            </span>
          </div>
          <ul className="text-base text-gray-700 space-y-1 mt-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> 
              💰 Smart Savings Commander
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> 
              🧼 Auto Declutter Bot
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> 
              🌍 Trend & Opportunity Radar
            </li>
          </ul>
          <button 
            onClick={() => setActiveTab('Wealth Hub')}
            className="mt-4 text-xs text-blue-700 hover:underline font-semibold cursor-pointer"
          >
            View Details
          </button>
          <div className="absolute right-2 top-2 w-16 h-16 bg-green-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition" />
        </motion.div>
        
        {/* Health Section */}
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(255,0,80,0.10)' }} className="relative bg-gradient-to-br from-red-100/80 to-pink-50/60 rounded-2xl p-6 flex flex-col gap-2 shadow-xl border border-red-200/60 backdrop-blur-md overflow-hidden min-h-[260px] group transition-all">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">❤️</span>
            <span className="font-bold text-red-700 text-lg">Health Monitoring</span>
            <span className="ml-auto bg-red-100/80 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              {healthAlerts.length} Alert{healthAlerts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ul className="text-base text-gray-700 space-y-1 mt-2">
            <li className="flex items-center gap-2">
              <span className="text-orange-500">⚠️</span> 
              🛌 Wellness Monitor
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-500">⚠️</span> 
              🤖 Lifestyle Buddy
            </li>
          </ul>
          <button 
            onClick={() => setActiveTab('Health Hub')}
            className="mt-4 text-xs text-red-700 hover:underline font-semibold cursor-pointer"
          >
            View Details
          </button>
          <div className="absolute left-2 bottom-2 w-16 h-16 bg-red-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition" />
        </motion.div>
        
        {/* Career Section */}
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(0,180,120,0.10)' }} className="relative bg-gradient-to-br from-green-100/80 to-teal-50/60 rounded-2xl p-6 flex flex-col gap-2 shadow-xl border border-green-200/60 backdrop-blur-md overflow-hidden min-h-[260px] group transition-all">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-green-700 text-lg">Career Advancement</span>
            <span className="ml-auto bg-blue-100/80 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              {careerOpportunities.length} Opp{careerOpportunities.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ul className="text-base text-gray-700 space-y-1 mt-2">
            <li className="flex items-center gap-2">
              <span className="text-blue-600">★</span> 
              📈 Growth Strategy Engine
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">★</span> 
              🧠 Career Compass AI
            </li>
          </ul>
          <button 
            onClick={() => setActiveTab('Career Hub')}
            className="mt-4 text-xs text-green-700 hover:underline font-semibold cursor-pointer"
          >
            View Details
          </button>
          <div className="absolute right-2 bottom-2 w-16 h-16 bg-blue-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition" />
        </motion.div>
      </div>
      
      {/* Floating Action Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 flex gap-4 bg-white/80 backdrop-blur-lg rounded-full shadow-lg px-6 py-3 border border-gray-200">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition text-sm">Play Audio Briefing</button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition text-sm">Share Wins</button>
      </motion.div>
    </div>
  );
}

// Wealth Hub component with real Night Agent data and table
function WealthHubContent() {
  const [nightAgentData, setNightAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNightAgentData = async () => {
      try {
        const data = await getNightAgentResults();
        setNightAgentData(data);
      } catch (error) {
        console.error('Error fetching Night Agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNightAgentData();
  }, []);

  const wealthSavings = nightAgentData?.summary?.moneySaved || nightAgentData?.totalSavings || 0;
  const annualSavings = (nightAgentData?.summary?.moneySavedAnnually || wealthSavings * 12);
  const wealthAchievements = nightAgentData?.details?.wealth || 
    nightAgentData?.alerts?.filter((alert: any) => 
      alert.message?.toLowerCase().includes('bill') || 
      alert.message?.toLowerCase().includes('subscription') ||
      alert.message?.toLowerCase().includes('saved') ||
      alert.message?.toLowerCase().includes('portfolio') ||
      alert.message?.toLowerCase().includes('comcast') ||
      alert.message?.toLowerCase().includes('spotify')
    ) || [];

  // Mock data for demonstration
  const wealthStories = [
    {
      id: 1,
      agent: "💰 Smart Savings Commander",
      action: "Negotiated Comcast bill from $110 to $80/month",
      impact: "+$30/month",
      status: "Completed",
      timestamp: "2:30 AM"
    },
    {
      id: 2,
      agent: "🧼 Auto Declutter Bot",
      action: "Cancelled unused Spotify subscription",
      impact: "+$10/month",
      status: "Completed",
      timestamp: "3:15 AM"
    },
    {
      id: 3,
      agent: "🌍 Trend & Opportunity Radar",
      action: "Analyzed portfolio and recommended NVDA purchase",
      impact: "Investment opportunity",
      status: "Completed",
      timestamp: "4:45 AM"
    }
  ];

  if (loading) {
    return (
      <div className="bg-yellow-50 rounded-xl p-8 shadow text-gray-800 flex flex-col gap-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading wealth data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 shadow-lg text-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">💰</span>
        <div>
          <div className="text-3xl font-bold text-yellow-700">Wealth Dashboard</div>
          <div className="text-lg text-gray-600">Annual Impact: <span className="font-bold text-green-600">+${annualSavings.toLocaleString()}</span></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">ADK Night Agent Accomplishments</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-yellow-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wealthStories.map((story) => (
                <tr key={story.id} className="hover:bg-yellow-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{story.agent}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{story.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{story.impact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {story.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{story.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-sm text-gray-500">Monthly Savings</div>
          <div className="text-2xl font-bold text-green-600">+${wealthSavings}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-sm text-gray-500">Annual Savings</div>
          <div className="text-2xl font-bold text-green-600">+${annualSavings.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-sm text-gray-500">Tasks Completed</div>
          <div className="text-2xl font-bold text-blue-600">{wealthStories.length}</div>
        </div>
      </div>
    </div>
  );
}

// Health Hub component with real Night Agent data and table
function HealthHubContent() {
  const [nightAgentData, setNightAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNightAgentData = async () => {
      try {
        const data = await getNightAgentResults();
        setNightAgentData(data);
      } catch (error) {
        console.error('Error fetching Night Agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNightAgentData();
  }, []);

  const healthAlerts = nightAgentData?.details?.health || 
    nightAgentData?.alerts?.filter((alert: any) => 
      alert.message?.toLowerCase().includes('sleep') || 
      alert.message?.toLowerCase().includes('massage') ||
      alert.message?.toLowerCase().includes('wellness') ||
      alert.message?.toLowerCase().includes('health')
    ) || [];

  // Mock data for demonstration
  const healthStories = [
    {
      id: 1,
      agent: "🛌 Wellness Monitor",
      action: "Detected elevated heart rate during sleep",
      impact: "Primary physician appointment scheduled",
      status: "Alert",
      timestamp: "1:45 AM"
    },
    {
      id: 2,
      agent: "🤖 Lifestyle Buddy",
      action: "Booked massage appointment for Friday evening",
      impact: "Stress relief scheduled",
      status: "Completed",
      timestamp: "3:30 AM"
    }
  ];

  if (loading) {
    return (
      <div className="bg-red-50 rounded-xl p-8 shadow text-gray-800 flex flex-col gap-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading health data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 shadow-lg text-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">❤️</span>
        <div>
          <div className="text-3xl font-bold text-red-700">Health Dashboard</div>
          <div className="text-lg text-gray-600">Health Alerts: <span className="font-bold text-red-600">{healthStories.length} Active</span></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">ADK Night Agent Accomplishments</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-red-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {healthStories.map((story) => (
                <tr key={story.id} className="hover:bg-red-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{story.agent}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{story.action}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-semibold">{story.impact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      story.status === 'Alert' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {story.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{story.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-sm text-gray-500">Health Alerts</div>
          <div className="text-2xl font-bold text-red-600">{healthStories.filter(s => s.status === 'Alert').length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-sm text-gray-500">Appointments Booked</div>
          <div className="text-2xl font-bold text-blue-600">{healthStories.filter(s => s.status === 'Completed').length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-sm text-gray-500">Tasks Completed</div>
          <div className="text-2xl font-bold text-green-600">{healthStories.length}</div>
        </div>
      </div>
    </div>
  );
}

// Career Hub component with real Night Agent data and table
function CareerHubContent() {
  const [nightAgentData, setNightAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNightAgentData = async () => {
      try {
        const data = await getNightAgentResults();
        setNightAgentData(data);
      } catch (error) {
        console.error('Error fetching Night Agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNightAgentData();
  }, []);

  const careerOpportunities = nightAgentData?.details?.career || 
    nightAgentData?.alerts?.filter((alert: any) => 
      alert.message?.toLowerCase().includes('job') || 
      alert.message?.toLowerCase().includes('career') ||
      alert.message?.toLowerCase().includes('opportunity') ||
      alert.message?.toLowerCase().includes('interview') ||
      alert.message?.toLowerCase().includes('google')
    ) || [];

  // Mock data for demonstration
  const careerStories = [
    {
      id: 1,
      agent: "📈 Growth Strategy Engine",
      action: "Booked mock interview session for Google preparation",
      impact: "Interview practice scheduled",
      status: "Completed",
      timestamp: "2:15 AM"
    },
    {
      id: 2,
      agent: "🧠 Career Compass AI",
      action: "Applied to job openings at Google, Netflix, Meta",
      impact: "3 applications submitted",
      status: "Completed",
      timestamp: "4:20 AM"
    }
  ];

  if (loading) {
    return (
      <div className="bg-green-50 rounded-xl p-8 shadow text-gray-800 flex flex-col gap-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading career data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 shadow-lg text-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🎯</span>
        <div>
          <div className="text-3xl font-bold text-green-700">Career Dashboard</div>
          <div className="text-lg text-gray-600">Opportunities Found: <span className="font-bold text-blue-600">{careerStories.length} Active</span></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">ADK Night Agent Accomplishments</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {careerStories.map((story) => (
                <tr key={story.id} className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{story.agent}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{story.action}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-semibold">{story.impact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {story.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{story.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-sm text-gray-500">Applications Submitted</div>
          <div className="text-2xl font-bold text-blue-600">3</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-sm text-gray-500">Interviews Scheduled</div>
          <div className="text-2xl font-bold text-green-600">1</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-sm text-gray-500">Tasks Completed</div>
          <div className="text-2xl font-bold text-purple-600">{careerStories.length}</div>
        </div>
      </div>
    </div>
  );
}

const demoCards: Record<TabName, JSX.Element> = {
  'Daily Brief': <DailyBriefContent setActiveTab={() => {}} />,
  'Wealth Hub': <WealthHubContent />,
  'Health Hub': <HealthHubContent />,
  'Career Hub': <CareerHubContent />,
  'Chat': <div className="h-full" />, // This will be handled dynamically
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabName>('Daily Brief');
  const [rightPanelVisible, setRightPanelVisible] = useState(false);
  
  // Chat history state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatSessionId, setCurrentChatSessionId] = useState<string | null>(null);
  
  // Notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Chat session handlers
  const handleSessionChange = (sessions: ChatSession[], currentSessionId: string | null) => {
    setChatSessions(sessions);
    setCurrentChatSessionId(currentSessionId);
  };

  const handleNewChat = () => {
    // Create a new chat session
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isUnread: false,
      isAgentInitiated: false
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentChatSessionId(newSessionId);
  };

  const handleLoadChatSession = (sessionId: string) => {
    setCurrentChatSessionId(sessionId);
  };
  
  // Handle tab changes
  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
    
    // Mother's Day trigger disabled - keeping only Candle Light Dinner trigger
  };

  // Render chat content dynamically
  const renderChatContent = () => {
    if (activeTab === 'Chat') {
      return (
        <div className="h-full">
          <ChatPanel 
            onSessionChange={handleSessionChange}
            currentSessionId={currentChatSessionId}
            sessions={chatSessions}
          />
        </div>
      );
    }
    return demoCards[activeTab];
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔔</span>
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}
      
      <TopNav activeTab={activeTab} setActiveTab={handleTabChange} />
      <LayoutPanels 
        rightPanelVisible={rightPanelVisible} 
        setActiveTab={setActiveTab}
        chatSessions={chatSessions}
        currentChatSessionId={currentChatSessionId}
        onChatSessionChange={handleSessionChange}
        onNewChat={handleNewChat}
        onLoadChatSession={handleLoadChatSession}
      >
        {activeTab === 'Daily Brief' ? (
          <DailyBriefContent setActiveTab={setActiveTab} />
        ) : (
          renderChatContent()
        )}
      </LayoutPanels>
    </div>
  );
}
