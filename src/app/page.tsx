"use client";
import React, { useState, useEffect, JSX } from 'react';
import { motion } from 'framer-motion';
import TopNav from './components/TopNav';
import LayoutPanels from './components/LayoutPanels';
import ChatPanel from './components/ChatPanel';
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
  const wealthSavings = nightAgentData?.totalSavings || 0;
  const healthAlerts = nightAgentData?.alerts?.filter((alert: any) => 
    alert.message?.toLowerCase().includes('sleep') || 
    alert.message?.toLowerCase().includes('massage') ||
    alert.message?.toLowerCase().includes('wellness')
  ) || [];
  const careerOpportunities = nightAgentData?.alerts?.filter((alert: any) => 
    alert.message?.toLowerCase().includes('job') || 
    alert.message?.toLowerCase().includes('career') ||
    alert.message?.toLowerCase().includes('opportunity')
  ) || [];

  // Get specific achievements from alerts
  const wealthAchievements = nightAgentData?.alerts?.filter((alert: any) => 
    alert.message?.toLowerCase().includes('bill') || 
    alert.message?.toLowerCase().includes('subscription') ||
    alert.message?.toLowerCase().includes('saved')
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
            `Here's what your ADK Night Agent accomplished while you slept:` :
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
              +<AnimatedCounter value={wealthSavings} prefix="$" />
            </span>
          </div>
          <ul className="text-base text-gray-700 space-y-1 mt-2">
            {wealthAchievements.length > 0 ? (
              wealthAchievements.slice(0, 3).map((achievement: any, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> 
                  {achievement.message}
                </li>
              ))
            ) : (
              <>
                <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Bill negotiation ready</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Subscription analysis ready</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Investment optimization ready</li>
              </>
            )}
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
            {healthAlerts.length > 0 ? (
              healthAlerts.slice(0, 3).map((alert: any, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-orange-500">⚠️</span> 
                  {alert.message}
                </li>
              ))
            ) : (
              <>
                <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Sleep analysis ready</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Wellness booking ready</li>
              </>
            )}
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
            {careerOpportunities.length > 0 ? (
              careerOpportunities.slice(0, 3).map((opportunity: any, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-blue-600">★</span> 
                  {opportunity.message}
                </li>
              ))
            ) : (
              <>
                <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Job scanning ready</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Career opportunities ready</li>
              </>
            )}
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
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition text-sm">Start Night Agent</button>
      </motion.div>
    </div>
  );
}

// Wealth Hub component with real Night Agent data
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

  const wealthSavings = nightAgentData?.totalSavings || 0;
  const wealthAchievements = nightAgentData?.alerts?.filter((alert: any) => 
    alert.message?.toLowerCase().includes('bill') || 
    alert.message?.toLowerCase().includes('subscription') ||
    alert.message?.toLowerCase().includes('saved') ||
    alert.message?.toLowerCase().includes('portfolio')
  ) || [];

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
    <div className="bg-yellow-50 rounded-xl p-8 shadow text-gray-800 flex flex-col gap-4">
      <div className="text-2xl font-bold mb-2">💰 Wealth Dashboard</div>
      <div className="text-lg">Monthly Impact: <span className="font-bold text-green-600">+${wealthSavings}</span></div>
      <div className="text-lg mb-4">ADK Night Agent Accomplishments:</div>
      <ul className="list-disc ml-6 text-base space-y-2">
        {wealthAchievements.length > 0 ? (
          wealthAchievements.map((achievement: any, index: number) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-green-600">✓</span> 
              {achievement.message}
            </li>
          ))
        ) : (
          <>
            <li>Bill negotiation ready</li>
            <li>Subscription analysis ready</li>
            <li>Investment optimization ready</li>
          </>
        )}
      </ul>
    </div>
  );
}

// Health Hub component with real Night Agent data
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

  const healthAlerts = nightAgentData?.alerts?.filter((alert: any) => 
    alert.message?.toLowerCase().includes('sleep') || 
    alert.message?.toLowerCase().includes('massage') ||
    alert.message?.toLowerCase().includes('wellness')
  ) || [];

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
    <div className="bg-red-50 rounded-xl p-8 shadow text-gray-800 flex flex-col gap-4">
      <div className="text-2xl font-bold mb-2">❤️ Health Dashboard</div>
      <div className="text-lg">Health Alerts: <span className="font-bold text-red-600">{healthAlerts.length} Active</span></div>
      <div className="text-lg mb-4">ADK Night Agent Accomplishments:</div>
      <ul className="list-disc ml-6 text-base space-y-2">
        {healthAlerts.length > 0 ? (
          healthAlerts.map((alert: any, index: number) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-orange-500">⚠️</span> 
              {alert.message}
            </li>
          ))
        ) : (
          <>
            <li>Sleep analysis ready</li>
            <li>Wellness booking ready</li>
          </>
        )}
      </ul>
    </div>
  );
}

// Career Hub component with real Night Agent data
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

  const careerOpportunities = nightAgentData?.alerts?.filter((alert: any) => 
    alert.message?.toLowerCase().includes('job') || 
    alert.message?.toLowerCase().includes('career') ||
    alert.message?.toLowerCase().includes('opportunity')
  ) || [];

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
    <div className="bg-green-50 rounded-xl p-8 shadow text-gray-800 flex flex-col gap-4">
      <div className="text-2xl font-bold mb-2">🎯 Career Dashboard</div>
      <div className="text-lg">Opportunities Found: <span className="font-bold text-blue-600">{careerOpportunities.length} Active</span></div>
      <div className="text-lg mb-4">ADK Night Agent Accomplishments:</div>
      <ul className="list-disc ml-6 text-base space-y-2">
        {careerOpportunities.length > 0 ? (
          careerOpportunities.map((opportunity: any, index: number) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-blue-600">★</span> 
              {opportunity.message}
            </li>
          ))
        ) : (
          <>
            <li>Job scanning ready</li>
            <li>Career opportunities ready</li>
          </>
        )}
      </ul>
    </div>
  );
}

const demoCards: Record<TabName, JSX.Element> = {
  'Daily Brief': <DailyBriefContent setActiveTab={() => {}} />,
  'Wealth Hub': <WealthHubContent />,
  'Health Hub': <HealthHubContent />,
  'Career Hub': <CareerHubContent />,
  'Chat': (
    <div className="h-full">
      <ChatPanel />
    </div>
  ),
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabName>('Daily Brief');
  const [rightPanelVisible, setRightPanelVisible] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <LayoutPanels rightPanelVisible={rightPanelVisible} setActiveTab={setActiveTab}>
        {activeTab === 'Daily Brief' ? (
          <DailyBriefContent setActiveTab={setActiveTab} />
        ) : (
          demoCards[activeTab]
        )}
      </LayoutPanels>
    </div>
  );
}
