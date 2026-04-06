"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, CheckCircle2, Target, MessageSquare, FileEdit, LineChart, Sparkles, AlertCircle, CalendarDays } from "lucide-react";
import { UiverseAnimatedCard } from "@/components/ui/uiverse-animated-card";

export default function DashboardPage() {
  const [data, setData] = useState({
    placementScore: 0,
    resumeScore: 0,
    commScore: 0,
    skillGaps: 0,
    nextMilestone: "Complete Voice Assessment",
  });

  useEffect(() => {
    // Mocking real delay + grabbing localstorage
    setTimeout(() => {
      setData({
        placementScore: 78,
        resumeScore: 82,
        commScore: 65,
        skillGaps: 4,
        nextMilestone: "Bridge Skill Gaps",
      });
    }, 500);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Welcome back, Alex</h1>
          <p className="text-gray-400 mt-2">Here is your career progression overview.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium neon-glow">
            Batch 2024
          </div>
          <div className="px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium">
            Pro Plan Active
          </div>
        </div>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Circular Progress Card for Placement Probability */}
        <div className="liquid-glass-card rounded-2xl p-6 flex items-center justify-between hover:neon-border transition-all group">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1 z-10 relative">Placement Probability</p>
            <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors z-10 relative">{data.placementScore}%</h3>
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1 z-10 relative">
              <TrendingUp className="h-3 w-3" /> +5% this week
            </p>
          </div>
          <div className="relative w-20 h-20 z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800/50" />
              <circle 
                cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={226} strokeDashoffset={226 - (226 * data.placementScore) / 100}
                className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,174,239,0.8)] transition-all duration-1000 ease-out" 
              />
            </svg>
          </div>
        </div>

        {/* ATS Score Card */}
        <div className="liquid-glass-card rounded-2xl p-6 flex items-center justify-between hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all group">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1 z-10 relative">ATS Resume Score</p>
            <h3 className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors z-10 relative">{data.resumeScore}%</h3>
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1 z-10 relative">
              <TrendingUp className="h-3 w-3" /> Passing
            </p>
          </div>
          <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30 z-10 relative group-hover:bg-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
            <FileEdit className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        {/* Comm Score Card */}
        <div className="liquid-glass-card rounded-2xl p-6 flex items-center justify-between hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all group">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1 z-10 relative">Communication Score</p>
            <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors z-10 relative">{data.commScore}%</h3>
            <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1 z-10 relative">
              <TrendingUp className="h-3 w-3" /> Needs Practice
            </p>
          </div>
          <div className="h-16 w-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 z-10 relative group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all">
            <MessageSquare className="h-8 w-8 text-cyan-400" />
          </div>
        </div>

        {/* Skills Card using existing animated wrapper */}
        <Link href="/dashboard/skills" className="group h-full">
          <div className="liquid-glass-card rounded-2xl p-6 h-full flex flex-col justify-between hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all">
            <div className="flex justify-between items-start z-10 relative">
              <p className="text-sm font-medium text-gray-400">Identified Skill Gaps</p>
              <ArrowUpRight className="h-5 w-5 text-gray-500 group-hover:text-orange-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <div className="z-10 relative">
              <h3 className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors">{data.skillGaps}</h3>
              <p className="text-xs text-gray-500 mt-2">Critical misses for target roles</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Charts & Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Line Chart (Mock) */}
        <div className="lg:col-span-2 liquid-glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-6 font-headline z-10 relative">Probability Trend Over Time</h3>
          
          <div className="h-64 w-full flex items-end justify-between gap-4 py-4 border-b border-white/10 relative z-10 transition-all">
            {/* Guide lines */}
            <div className="absolute inset-0 flex flex-col justify-between z-0">
              <div className="h-[1px] w-full bg-white/5"></div>
              <div className="h-[1px] w-full bg-white/5"></div>
              <div className="h-[1px] w-full bg-white/5"></div>
              <div className="h-[1px] w-full bg-white/5"></div>
            </div>
            {/* Mock Bars/Trend */}
            {[45, 52, 60, 58, 65, 72, 78].map((val, i) => (
              <div key={i} className="relative z-10 w-full flex justify-center group flex-1">
                <div 
                  className="w-12 bg-gradient-to-t from-cyan-900/40 to-cyan-400/80 rounded-t-lg transition-all duration-700 ease-out group-hover:to-cyan-400 group-hover:shadow-[0_0_25px_rgba(0,174,239,0.7)]"
                  style={{ height: `${val}%` }}
                ></div>
                <span className="absolute -top-8 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_5px_rgba(0,174,239,1)]">{val}%</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500 z-10 relative">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </div>

        {/* Weakness Heatmap & Tasks */}
        <div className="liquid-glass-card rounded-2xl p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 font-headline">Weakness Heatmap</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">System Design</span>
                  <span className="text-accent font-medium">Critical</span>
                </div>
                <div className="h-2 w-full bg-black/20 ring-1 ring-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[30%] shadow-[0_0_10px_rgba(255,50,50,0.5)]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Verbal Fluency</span>
                  <span className="text-orange-400 font-medium">Moderate</span>
                </div>
                <div className="h-2 w-full bg-black/20 ring-1 ring-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 w-[55%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Algorithm Patterns</span>
                  <span className="text-primary font-medium">Strong</span>
                </div>
                <div className="h-2 w-full bg-black/20 ring-1 ring-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] neon-glow"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 glass backdrop-blur-xl rounded-xl p-4 border border-white/10 relative overflow-hidden group hover:neon-glow transition-all">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 z-10 relative">
              <CalendarDays className="h-4 w-4 text-cyan-400" /> Daily Task
            </h4>
            <div className="flex items-start gap-3 z-10 relative">
              <div className="h-5 w-5 rounded-full border border-gray-500 flex-shrink-0 mt-0.5 cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,174,239,0.5)] transition-all"></div>
              <div>
                <p className="text-sm font-medium text-gray-200">{data.nextMilestone}</p>
                <p className="text-xs text-cyan-400 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">Recommended by your AI Mentor to push your probability to 80%.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
