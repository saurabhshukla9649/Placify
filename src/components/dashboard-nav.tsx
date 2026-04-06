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
    <nav className="flex flex-col gap-2 p-4 h-full">
      <div className="flex items-center gap-3 px-2 py-6 mb-4">
        <div className="glass rounded-md p-1.5 neon-border neon-glow relative overflow-hidden group">
          <div className="absolute inset-0 bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <LineChart className="h-5 w-5 text-cyan-400 relative z-10" />
        </div>
        <span className="text-2xl font-headline font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(0,174,239,0.5)]">Placify</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 as-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-[rgba(0,174,239,0.1)] text-cyan-400 border border-cyan-500/50 neon-glow" 
                  : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-500")} />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-white/10 px-2 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 border border-white/20"></div>
          <div>
            <p className="text-sm font-medium text-white">Student User</p>
            <p className="text-xs text-gray-500">Free Tier</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
