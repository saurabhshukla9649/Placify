import React from "react";

export const UiverseGlowButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`relative inline-flex h-12 md:h-14 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-transform hover:scale-[1.02] active:scale-95 ${className || ""}`}
        {...props}
      >
        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e2e8f0_0%,hsl(var(--primary))_50%,#e2e8f0_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,hsl(var(--primary))_50%,transparent_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-8 py-2 font-medium text-foreground backdrop-blur-3xl whitespace-nowrap">
          {children}
        </span>
      </button>
    );
  }
);
UiverseGlowButton.displayName = "UiverseGlowButton";
