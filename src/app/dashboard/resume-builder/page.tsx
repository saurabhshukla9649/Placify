"use client";

import React, { useState } from "react";
import { ResumeProvider, useResume, defaultData } from "./ResumeContext";
import { Editor } from "./Editor";
import { Button } from "@/components/ui/button";
import { SimpleTemplate } from "@/components/resume-templates/SimpleTemplate";
import { ModernTemplate } from "@/components/resume-templates/ModernTemplate";
import { CreativeTemplate } from "@/components/resume-templates/CreativeTemplate";
import { TechInnovator } from "@/components/resume-templates/TechInnovator";
import { ExecutiveStyle } from "@/components/resume-templates/ExecutiveStyle";
import { CompactATS } from "@/components/resume-templates/CompactATS";
import { DarkSidebar } from "@/components/resume-templates/DarkSidebar";
import { CardBased } from "@/components/resume-templates/CardBased";
import { RightAvatar } from "@/components/resume-templates/RightAvatar";
import { TimelineLayout } from "@/components/resume-templates/TimelineLayout";
import { VibrantBanner } from "@/components/resume-templates/VibrantBanner";
import { CodeHacker } from "@/components/resume-templates/CodeHacker";

function TemplateSelection({ onSelect }: { onSelect: () => void }) {
  const { setSelectedTemplate } = useResume();

  const templates = [
    { id: "simple", name: "Simple ATS", desc: "Clean and minimal. Perfect for strict ATS systems.", component: SimpleTemplate },
    { id: "modern", name: "Modern Professional", desc: "A sleek two-column layout for a modern touch.", component: ModernTemplate },
    { id: "creative", name: "Creative Edge", desc: "Stand out with bold colors and typography.", component: CreativeTemplate },
    { id: "tech", name: "Tech Innovator", desc: "Profile photo supported standard layout.", component: TechInnovator },
    { id: "executive", name: "Executive Style", desc: "A prestigious formal layout for senior roles.", component: ExecutiveStyle },
    { id: "compact", name: "Compact ATS", desc: "Fit more information on a tightly packed page.", component: CompactATS },
    { id: "dark_sidebar", name: "Dark Sidebar", desc: "A bold black sidebar framing your experience.", component: DarkSidebar },
    { id: "card", name: "Card UI Design", desc: "Modern elevated cards with discrete sections.", component: CardBased },
    { id: "right_avatar", name: "Right Avatar", desc: "Reverse flow with right-aligned photography.", component: RightAvatar },
    { id: "timeline", name: "Career Timeline", desc: "Visual node connections across your experience.", component: TimelineLayout },
    { id: "vibrant", name: "Vibrant Banner", desc: "Explosive gradient color top header.", component: VibrantBanner },
    { id: "code", name: "Code Hacker", desc: "Monospace code block styling for developers.", component: CodeHacker },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -z-10 pointer-events-none mix-blend-screen opacity-50"></div>
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-[#6100FF]/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen opacity-50"></div>

      <header className="text-center max-w-3xl mx-auto pt-10">
        <h1 className="text-5xl font-headline font-bold text-white tracking-tight mb-4">Choose Your <span className="text-primary neon-glow">Template</span></h1>
        <p className="text-gray-400 text-lg">Select a professionally designed template to start building your resume. You can always change it later without losing data.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-6 max-w-[1800px] mx-auto">
        {templates.map((tpl) => {
          const TemplateComponent = tpl.component;
          return (
            <div key={tpl.id} className="group relative glass-card rounded-2xl p-4 border border-white/10 hover:border-primary/50 transition-all duration-500 cursor-pointer flex flex-col h-full bg-black/40 hover:bg-black/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                 onClick={() => {
                   setSelectedTemplate(tpl.id);
                   onSelect();
                 }}>
              
              {/* Template Preview Component */}
              <div className="w-full aspect-[8.5/11] rounded-md mb-5 overflow-hidden relative shadow-lg bg-gray-100 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02] border border-white/10 group-hover:shadow-[0_15px_40px_rgba(0,174,239,0.2)]">
                
                {/* Render Actual Component but Scaled Down */}
                <div className="absolute top-0 left-0 origin-top-left pointer-events-none" style={{ width: '800px', transform: 'scale(0.24)' }}>
                   <TemplateComponent overrideData={defaultData} />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 shrink-0">
                  <Button className="bg-primary text-black hover:bg-blue-400 font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)] px-6 py-2 h-auto text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Use Template
                  </Button>
                </div>
              </div>

              <div className="text-center mt-auto">
                <h3 className="text-[16px] font-bold text-white mb-1.5 leading-tight group-hover:text-primary transition-colors">{tpl.name}</h3>
                <p className="text-[12px] text-gray-400 leading-snug">{tpl.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

function BuilderFlow() {
  const [step, setStep] = useState<"templates" | "editor">("templates");

  return (
    <>
      {step === "templates" && <TemplateSelection onSelect={() => setStep("editor")} />}
      {step === "editor" && <Editor onBack={() => setStep("templates")} />}
    </>
  );
}

export default function ResumeBuilderPage() {
  return (
    <ResumeProvider>
      <BuilderFlow />
    </ResumeProvider>
  );
}
