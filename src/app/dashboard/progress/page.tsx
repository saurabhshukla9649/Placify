"use client";

import { BarChart, TrendingUp, Award, Calendar, Activity, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProgressTrackerPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Progress Tracker</h1>
        <p className="text-gray-400 mt-2">Monitor your growth, identify patterns, and watch your placement probability soar.</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Placement Prob.</p>
              <h3 className="text-3xl font-headline font-bold text-white mt-1">84%</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <TrendingUp className="h-3 w-3" /> +12% this week
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Mock Interviews</p>
              <h3 className="text-3xl font-headline font-bold text-white mt-1">12</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <span className="text-purple-400">4 hours</span> total duration
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Current Streak</p>
              <h3 className="text-3xl font-headline font-bold text-white mt-1">5 Days</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 animate-pulse">
            Keep it up!
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Skills Mastered</p>
              <h3 className="text-3xl font-headline font-bold text-white mt-1">8</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            +2 new skills earned
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area (Mocked with CSS bars for neon aesthetic) */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none transition-all group-hover:bg-primary/10"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-headline font-bold text-white">Placement Probability Trend</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Last 30 Days</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 cursor-pointer hover:text-white transition-all">
              <BarChart className="h-4 w-4" />
            </div>
          </div>

          <div className="h-[300px] flex items-end gap-2 justify-between relative z-10 mx-4">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-white/10 pointer-events-none opacity-50 z-[-1]">
              {[100, 75, 50, 25, 0].map((val) => (
                <div key={val} className="w-full h-[1px] bg-white/5 relative">
                  <span className="absolute -left-8 -top-2 text-[10px] text-gray-500 font-mono">{val}%</span>
                </div>
              ))}
            </div>

            {/* Mock Data Bars */}
            {[45, 52, 48, 58, 63, 60, 68, 72, 70, 78, 81, 84].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                <div className="w-full relative flex justify-center group-hover/bar:bg-white/5 rounded-t-sm transition-all h-full items-end pb-1">
                  <div 
                    className={`w-4/5 max-w-[2rem] rounded-t-sm transition-all duration-1000 ${
                      i === 11 ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'bg-primary/40 group-hover/bar:bg-primary/60'
                    }`}
                    style={{ height: `${val}%` }}
                  ></div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 bg-black/60 backdrop-blur-md border border-white/10 rounded px-2 py-1 text-[10px] text-white font-mono whitespace-nowrap transition-opacity shrink-0 pointer-events-none z-20">
                    Day {i * 2 + 1}: {val}%
                  </div>
                </div>
                <span className="text-[9px] text-gray-500 uppercase">D{i*2+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses Radar Data / Progress Bars */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-headline font-bold text-white mb-2">Skill Trajectory</h3>
            <p className="text-xs text-gray-400 leading-relaxed">AI analysis of your core technical and soft skills over time.</p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-300">Communication</span>
                <span className="text-xs font-mono text-purple-400">82%</span>
              </div>
              <Progress value={82} className="h-2 bg-black/20 ring-1 ring-white/10 [&>div]:bg-purple-500" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-300">Data Structures</span>
                <span className="text-xs font-mono text-cyan-400">90%</span>
              </div>
              <Progress value={90} className="h-2 bg-black/20 ring-1 ring-white/10 [&>div]:bg-cyan-500" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-300">System Design</span>
                <span className="text-xs font-mono text-orange-400">45%</span>
              </div>
              <Progress value={45} className="h-2 bg-black/20 ring-1 ring-white/10 [&>div]:bg-orange-500" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-300">Frontend (React)</span>
                <span className="text-xs font-mono text-emerald-400">95%</span>
              </div>
              <Progress value={95} className="h-2 bg-black/20 ring-1 ring-white/10 [&>div]:bg-emerald-500" />
            </div>
          </div>
          
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mt-auto">
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1">Critical Insight</p>
            <p className="text-sm text-gray-300">You need to focus on <span className="font-bold text-white">System Design</span> to increase your chance of passing Senior-level interviews.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
