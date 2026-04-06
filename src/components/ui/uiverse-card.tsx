import React from "react";

export const UiverseCard = ({ title, description, icon, className, ...props }: any) => {
  return (
    <div 
      className={`group relative w-full overflow-hidden rounded-3xl bg-card border border-border/40 p-8 transition-all hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)] hover:border-primary/50 duration-500 ${className || ""}`} 
      {...props}
    >
      {/* Background glowing orbs */}
      <div className="absolute -right-20 -top-20 z-0 h-40 w-40 rounded-full bg-primary/10 blur-[60px] group-hover:bg-primary/30 transition-colors duration-500" />
      <div className="absolute -bottom-20 -left-20 z-0 h-40 w-40 rounded-full bg-accent/10 blur-[60px] group-hover:bg-accent/30 transition-colors duration-500" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Floating Icon Container */}
        <div className="p-4 bg-background/50 rounded-2xl backdrop-blur-md border border-border/50 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 shadow-md group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
          {icon}
        </div>
        
        {/* Texts */}
        <h3 className="text-xl font-headline font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground text-sm font-body leading-relaxed">{description}</p>
      </div>
      
      {/* Bottom animated border line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 ease-out" />
    </div>
  );
};
