"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { startNightMode, getNightProgress, getMorningReport } from "./api";
import { AnimatePresence, motion as m } from "framer-motion";

export default function NightAgentPage() {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [impact, setImpact] = useState({ money: 0, health: 0, opportunities: 0 });
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(7);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const [negotiationSteps, setNegotiationSteps] = useState<string[]>([]);

  // Start Night Mode
  const handleStart = async () => {
    setLoading(true);
    setError(null);
    console.log('[NightAgent] User clicked Start Night Mode');
    try {
      const resp = await startNightMode();
      console.log('[NightAgent] /api/night-agent/start response:', resp);
      setStarted(true);
    } catch (err: any) {
      setError("Failed to start Night Mode: " + (err.message || err.toString()));
      console.error('[NightAgent] Error starting Night Mode:', err);
    }
    setLoading(false);
  };

  // Poll progress from backend
  useEffect(() => {
    if (!started) return;
    pollRef.current = setInterval(async () => {
      try {
        const prog = await getNightProgress();
        console.log('[NightAgent] /api/night-agent/progress response:', prog);
        setCompletedTasks(prog.completedTasks);
        setTotalTasks(prog.totalTasks);
        setCurrentTask(prog.currentTask);
        setNegotiationSteps(prog.negotiationSteps || []);
        setImpact({
          money: prog.totalSavings || 0,
          health: prog.alerts ? prog.alerts.filter((a: any) => a.type === "health").length : 0,
          opportunities: prog.alerts ? prog.alerts.filter((a: any) => a.type === "career").length : 0,
        });
        setProgress(Math.round((prog.completedTasks / prog.totalTasks) * 100));
        if (prog.status === "completed") {
          setCompleted(true);
          clearInterval(pollRef.current!);
        }
      } catch (err: any) {
        setError("Failed to fetch progress: " + (err.message || err.toString()));
        console.error('[NightAgent] Error fetching progress:', err);
        clearInterval(pollRef.current!);
      }
    }, 1000);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [started]);

  // Fetch report when completed
  useEffect(() => {
    if (!completed) return;
    (async () => {
      try {
        const rep = await getMorningReport();
        console.log('[NightAgent] /api/night-agent/report response:', rep);
        setReport(rep);
      } catch (err: any) {
        setError("Failed to fetch report: " + (err.message || err.toString()));
        console.error('[NightAgent] Error fetching report:', err);
      }
    })();
  }, [completed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex flex-col items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-200 drop-shadow mb-2">🌙 LifeOS Night Agent</h1>
        <div className="text-lg text-blue-100">Autonomous AI optimizing your life while you sleep</div>
      </motion.div>
      <div className="w-full max-w-3xl bg-white/10 rounded-2xl shadow-2xl p-8 flex flex-col gap-8">
        {error && <div className="text-red-400 text-center font-bold mb-4">{error}</div>}
        {!started ? (
          <div className="flex flex-col items-center gap-4">
            <button
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-bold text-lg shadow hover:bg-blue-600 transition"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? "Starting..." : "Start Night Mode"}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-8 justify-between">
              <div className="flex flex-col items-center">
                <span className="text-2xl text-green-300 font-bold">${impact.money}</span>
                <span className="text-xs text-green-100">Money Saved</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl text-pink-300 font-bold">{impact.health}</span>
                <span className="text-xs text-pink-100">Health Wins</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl text-yellow-300 font-bold">{impact.opportunities}</span>
                <span className="text-xs text-yellow-100">Opportunities</span>
              </div>
            </div>
            <div className="w-full bg-blue-900/40 rounded-full h-6 flex items-center relative overflow-hidden">
              <motion.div
                className="bg-blue-400 h-6 rounded-full absolute left-0 top-0"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                style={{ width: `${progress}%` }}
              />
              <span className="w-full text-center text-blue-100 font-semibold z-10">
                {completed ? "Night Mode Complete!" : `Progress: ${progress}%`}
              </span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {currentTask && (
                <motion.div
                  key={currentTask.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex flex-col gap-2 p-4 rounded-xl shadow-lg border border-white/10 bg-blue-800/60 border-blue-400/40`}
                >
                  <span className="text-lg font-bold">{currentTask.name}</span>
                  {/* Show live negotiation steps for any task */}
                  {negotiationSteps.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 text-blue-100 text-sm font-mono bg-blue-950/40 rounded p-2 min-h-[120px] max-w-full">
                      <AnimatePresence initial={false}>
                        {negotiationSteps.map((step, idx) => (
                          <m.span
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                            className="whitespace-pre-line text-left break-words max-w-full"
                          >
                            {step}
                          </m.span>
                        ))}
                      </AnimatePresence>
                      {/* Blinking cursor if still running */}
                      {!completed && <span className="text-blue-300 animate-pulse">▍</span>}
                    </div>
                  )}
                  {negotiationSteps.length === 0 && <span className="ml-4 text-sm font-mono">Working...</span>}
                </motion.div>
              )}
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-blue-200 text-sm">Completed Tasks: {completedTasks} / {totalTasks}</span>
              </div>
            </div>
            {completed && report && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-center">
                <div className="text-2xl font-bold text-green-300 mb-2">🌅 Morning Report Ready!</div>
                <div className="text-blue-100">Total Money Saved: <span className="font-bold text-green-200">${report.summary.moneySaved}</span></div>
                <div className="text-blue-100">Health Wins: <span className="font-bold text-pink-200">{report.summary.healthAlertsAddressed}</span></div>
                <div className="text-blue-100">Opportunities Found: <span className="font-bold text-yellow-200">{report.summary.careerOpportunities}</span></div>
                {/* Show Bill Negotiation Script if present */}
                {report.details.wealth && report.details.wealth[0] && report.details.wealth[0].script && (
                  <div className="mt-6 bg-blue-950/80 rounded-xl p-4 text-left text-blue-100 shadow">
                    <div className="font-bold text-blue-300 mb-2">💰 Bill Negotiation Script (Gemini):</div>
                    <pre className="whitespace-pre-wrap text-sm text-blue-100">{report.details.wealth[0].script}</pre>
                  </div>
                )}
                {/* Show Market Analysis Result if present */}
                {report.details.market && report.details.market[0] && report.details.market[0].result && (
                  <div className="mt-6 bg-blue-950/80 rounded-xl p-4 text-left text-blue-100 shadow">
                    <div className="font-bold text-blue-300 mb-2">📈 Market Analysis (Gemini):</div>
                    <pre className="whitespace-pre-wrap text-sm text-blue-100">{report.details.market[0].result}</pre>
                  </div>
                )}
                <div className="mt-4">
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition text-lg">View Full Report</button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 