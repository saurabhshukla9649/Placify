import React from "react";

interface UiverseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const UiverseButton = React.forwardRef<HTMLButtonElement, UiverseButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`group relative inline-flex h-12 md:h-14 items-center justify-center overflow-hidden rounded-full font-medium text-white bg-primary duration-300 active:scale-95 px-8 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] ${className || ""}`}
        {...props}
      >
        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
          <div className="relative h-full w-8 bg-white/30" />
        </div>
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
UiverseButton.displayName = "UiverseButton";
