"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, CheckCircle2, Target, MessageSquare, FileEdit, LineChart, Sparkles, AlertCircle, CalendarDays } from "lucide-react";

// Animated counter hook
function useAnimatedCounter(endValue: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * endValue));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [endValue, duration]);

  return count;
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useAnimatedCounter(value, 1500);
  return <>{count}</>;
};

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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Welcome back, Alex</h1>
          <p className="text-gray-400 mt-2">Here is your career progression overview.</p>
        </div>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Circular Progress Card for Placement Probability */}
        <div className="liquid-glass-card rounded-3xl p-6 flex items-center justify-between hover:neon-border transition-all duration-500 group">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1 z-10 relative">Placement Probability</p>
            <h3 className="text-4xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-500 z-10 relative drop-shadow-md">
              <AnimatedNumber value={data.placementScore} />%
            </h3>
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1 z-10 relative bg-green-500/10 w-max px-2 py-1 rounded-full border border-green-500/20">
              <TrendingUp className="h-3 w-3" /> +5% this week
            </p>
          </div>
          <div className="relative w-24 h-24 z-10 scale-90 group-hover:scale-100 transition-transform duration-500">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
              <circle 
                cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={264} strokeDashoffset={264 - (264 * data.placementScore) / 100}
                className="text-cyan-400 drop-shadow-[0_0_15px_rgba(0,174,239,0.8)] transition-all duration-1500 ease-out" 
              />
            </svg>
          </div>
        </div>

        {/* ATS Score Card */}
        <div className="liquid-glass-card rounded-3xl p-6 flex items-center justify-between hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500 group">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1 z-10 relative">ATS Resume Score</p>
            <h3 className="text-4xl font-bold text-white group-hover:text-purple-400 transition-colors duration-500 z-10 relative drop-shadow-md">
              <AnimatedNumber value={data.resumeScore} />%
            </h3>
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1 z-10 relative bg-green-500/10 w-max px-2 py-1 rounded-full border border-green-500/20">
              <TrendingUp className="h-3 w-3" /> Passing
            </p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/30 z-10 relative group-hover:bg-purple-500/20 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-500">
            <FileEdit className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Comm Score Card */}
        <div className="liquid-glass-card rounded-3xl p-6 flex items-center justify-between hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-500 group">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1 z-10 relative">Communication Score</p>
            <h3 className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors duration-500 z-10 relative drop-shadow-md">
              <AnimatedNumber value={data.commScore} />%
            </h3>
            <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1 z-10 relative bg-yellow-500/10 w-max px-2 py-1 rounded-full border border-yellow-500/20">
              <AlertCircle className="h-3 w-3" /> Needs Practice
            </p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30 z-10 relative group-hover:bg-blue-500/20 group-hover:-rotate-6 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-500">
            <MessageSquare className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Skills Card */}
        <Link href="/dashboard/skills" className="group h-full block">
          <div className="liquid-glass-card rounded-3xl p-6 h-full flex flex-col justify-between hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-500/20 blur-[50px] group-hover:bg-orange-500/40 transition-colors duration-500"></div>
            <div className="flex justify-between items-start z-10 relative">
              <p className="text-sm font-medium text-gray-400 mt-1">Identified Skill Gaps</p>
              <div className="p-2 glass rounded-full group-hover:bg-orange-500/20 transition-colors border border-transparent group-hover:border-orange-500/50">
                 <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-orange-400 transition-colors" />
              </div>
            </div>
            <div className="z-10 relative mt-4">
              <h3 className="text-5xl font-bold text-white group-hover:text-orange-400 transition-colors duration-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                <AnimatedNumber value={data.skillGaps} />
              </h3>
              <p className="text-xs text-gray-400 mt-2">Critical misses for target roles</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Charts & Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Line Chart (Mock) */}
        <div className="lg:col-span-2 liquid-glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-1000"></div>
          <h3 className="text-2xl font-bold text-white mb-8 font-headline z-10 relative tracking-tight">Probability Trend Over Time</h3>
          
          <div className="h-72 w-full flex items-end justify-between gap-4 py-4 border-b border-white/5 relative z-10 transition-all">
            {/* Guide lines */}
            <div className="absolute inset-0 flex flex-col justify-between z-0">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>
            {/* Mock Trend Bars */}
            {[45, 52, 60, 58, 65, 72, 78].map((val, i) => (
              <div key={i} className="relative z-10 w-full flex justify-center group/bar flex-1 h-full items-end">
                <div 
                  className="w-full max-w-[48px] bg-gradient-to-t from-cyan-900/40 via-cyan-600/60 to-cyan-400/80 rounded-t-xl transition-all duration-700 ease-out group-hover/bar:to-cyan-300 group-hover/bar:shadow-[0_0_30px_rgba(0,174,239,0.8)] opacity-70 group-hover/bar:opacity-100 border border-transparent border-t-cyan-300/50 group-hover/bar:border-cyan-300 relative overflow-hidden animate-in fade-in zoom-in"
                  style={{ height: `${val}%`, animationDelay: `${i * 100}ms` }}
                >
                  <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-white/30 to-transparent"></div>
                </div>
                <span className="absolute -top-10 text-sm font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,174,239,1)] translate-y-2 group-hover/bar:translate-y-0">{val}%</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-sm font-medium text-gray-500 z-10 relative px-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span className="text-cyan-400">Jul</span>
          </div>
        </div>

        {/* Weakness Heatmap & Tasks */}
        <div className="liquid-glass-card rounded-3xl p-8 flex flex-col gap-8 group/heatmap">
          <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-6 font-headline tracking-tight">Weakness Heatmap</h3>
            <div className="space-y-5 relative z-10">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-200 font-medium font-mono">System Design</span>
                  <span className="text-red-500 font-bold tracking-wider drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">CRITICAL</span>
                </div>
                <div className="h-2.5 w-full bg-black/40 shadow-inner ring-1 ring-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-600 to-red-400 w-[30%] shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-200 font-medium font-mono">Verbal Fluency</span>
                  <span className="text-orange-400 font-bold tracking-wider drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">MODERATE</span>
                </div>
                <div className="h-2.5 w-full bg-black/40 shadow-inner ring-1 ring-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 w-[55%] shadow-[0_0_15px_rgba(249,115,22,0.6)] rounded-full transition-all duration-1000"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-200 font-medium font-mono">Algorithm Patterns</span>
                  <span className="text-cyan-400 font-bold tracking-wider drop-shadow-[0_0_5px_rgba(0,174,239,0.5)]">STRONG</span>
                </div>
                <div className="h-2.5 w-full bg-black/40 shadow-inner ring-1 ring-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 w-[85%] neon-glow rounded-full transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 glass backdrop-blur-3xl rounded-2xl p-5 border border-white/10 relative overflow-hidden group/task hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,174,239,0.3)] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover/task:opacity-100 transition-opacity duration-500"></div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 z-10 relative uppercase tracking-widest text-cyan-400">
              <Sparkles className="h-4 w-4 drop-shadow-[0_0_5px_rgba(0,174,239,0.8)]" /> AI Recommended Task
            </h4>
            <div className="flex items-start gap-4 z-10 relative">
              <div className="h-6 w-6 rounded-full border-2 border-gray-500 flex-shrink-0 cursor-pointer hover:bg-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,174,239,0.8)] transition-all duration-300 flex items-center justify-center"></div>
              <div>
                <p className="text-base font-semibold text-white group-hover/task:text-cyan-100 transition-colors">{data.nextMilestone}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">Completing this block will push your probability by <span className="text-cyan-400 font-bold">+3%</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
