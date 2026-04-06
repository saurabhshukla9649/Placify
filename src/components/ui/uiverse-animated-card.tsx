import React from "react";
import { ArrowUpRight } from "lucide-react";

interface UiverseAnimatedCardProps {
  title: string;
  subtitle: string;
  value: React.ReactNode;
  topRightText?: string;
  actionIcon?: React.ReactNode;
  className?: string;
}

export const UiverseAnimatedCard: React.FC<UiverseAnimatedCardProps> = ({
  title,
  subtitle,
  value,
  topRightText,
  actionIcon,
  className,
}) => {
  return (
    <div
      className={`relative border border-solid border-border/40 rounded-2xl overflow-hidden shadow-xl group ${className || "w-[200px] h-[300px]"}`}
    >
      <div className="w-full h-full p-1 absolute bg-primary/40 dark:bg-primary/80">
        <div className="w-full h-full rounded-xl rounded-tr-[100px] rounded-br-[40px] bg-card"></div>
      </div>

      <div className="w-full h-full flex items-center justify-center relative backdrop-blur-md rounded-2xl">
        <div
          className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-accent animate-spin opacity-50 blur-2xl group-hover:opacity-80 transition-opacity duration-500"
          style={{ animationDuration: "12s" }}
        ></div>
      </div>

      <div className="w-full h-full p-2 flex justify-between absolute inset-0">
        <div className="w-3/5 p-3 flex flex-col rounded-xl backdrop-blur-lg bg-foreground/5 border border-foreground/10 text-foreground font-medium z-10 shadow-sm">
          <span className="text-xl font-headline font-bold truncate">{title}</span>
          <span className="text-xs text-muted-foreground mt-1 leading-snug">{subtitle}</span>
          <div className="w-full mt-auto flex items-center justify-start pb-2">
            <span className="text-5xl font-black text-primary">{value}</span>
          </div>
        </div>

        <div className="h-full pt-3 pb-3 pr-2 flex flex-col items-end text-muted-foreground z-10 w-2/5">
          {topRightText && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] leading-[12px] font-bold uppercase tracking-widest text-accent">Placify</span>
              <span className="text-[10px] leading-[13px]">{topRightText}</span>
            </div>
          )}
          
          <div className="w-10 h-10 mt-auto flex items-center justify-center rounded-full backdrop-blur-lg bg-foreground/10 cursor-pointer transition-all duration-300 hover:bg-foreground/20 hover:scale-110 text-primary border border-foreground/5 shadow-md">
            {actionIcon || <ArrowUpRight className="w-5 h-5" />}
          </div>
        </div>
      </div>
    </div>
  );
};
