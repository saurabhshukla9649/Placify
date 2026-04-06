"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Mic2, Target, MessageSquare, LineChart, FileEdit, Bot, CalendarDays, Settings } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Builder", href: "/dashboard/resume-builder", icon: FileEdit },
  { name: "Resume Analysis", href: "/dashboard/resume", icon: FileText },
  { name: "Voice Analysis", href: "/dashboard/communication", icon: Mic2 },
  { name: "Skill Gaps", href: "/dashboard/skills", icon: Target },
  { name: "Mock Interview", href: "/dashboard/mock-interview", icon: MessageSquare },
  { name: "AI Mentor", href: "/dashboard/ai-mentor", icon: Bot },
  { name: "Progress Tracker", href: "/dashboard/progress", icon: CalendarDays },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-4 h-full glass-card border-r border-white/5 bg-black/40 relative overflow-hidden z-10 w-full lg:w-64">
      {/* Background ambient glow for sidebar */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50 block" />
      
      <div className="flex items-center gap-3 px-2 py-6 mb-2 relative z-10">
        <div className="glass rounded-xl p-2 border border-primary/40 shadow-[0_0_15px_rgba(0,174,239,0.3)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/20 blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <LineChart className="h-6 w-6 text-primary relative z-10 drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]" />
        </div>
        <span className="text-2xl font-headline font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Placify</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1.5 as-scrollbar pr-2 relative z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/dashboard');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-400 overflow-hidden",
                isActive 
                  ? "text-white shadow-[0_0_20px_rgba(0,174,239,0.15)] ring-1 ring-primary/40" 
                  : "text-gray-400 hover:text-white hover:border-white/10"
              )}
            >
              {/* Magic hover background */}
              <div className={cn(
                "absolute inset-0 transition-opacity duration-500",
                isActive ? "bg-gradient-to-r from-primary/20 to-transparent opacity-100" : "bg-white/5 opacity-0 group-hover:opacity-100"
              )} />
              
              <Icon className={cn(
                "h-5 w-5 relative z-10 transition-colors duration-300", 
                 isActive ? "text-primary drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]" : "text-gray-500 group-hover:text-gray-300"
              )} />
              <span className="relative z-10">{item.name}</span>
              
              {/* Active indicator dot */}
              {isActive && (
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,174,239,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 px-2 pb-2 relative z-10">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 border-2 border-white/10 shadow-[0_0_15px_rgba(0,174,239,0.2)] group-hover:shadow-[0_0_20px_rgba(111,0,255,0.4)] transition-all"></div>
          <div>
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Student User</p>
            <p className="text-xs text-gray-400 font-mono">Premium</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
