"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  title: string;
  score: number;
  subtitle?: string;
  className?: string;
  variant?: "primary" | "accent";
}

export function ScoreCard({ title, score, subtitle, className, variant = "primary" }: ScoreCardProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className={cn("overflow-hidden border-none shadow-lg", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-4">
        <div className="relative h-28 w-28">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              className="text-muted/20 stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
            />
            <circle
              className={cn(
                "stroke-current transition-all duration-1000 ease-out",
                variant === "primary" ? "text-primary" : "text-accent"
              )}
              strokeWidth="10"
              strokeDasharray={circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-headline font-bold">{score}%</span>
          </div>
        </div>
        {subtitle && <p className="mt-4 text-xs text-muted-foreground text-center px-4">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}