"use client";

import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useResume } from "./ResumeContext";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Plus, Download, Sparkles, LayoutTemplate, Briefcase, GraduationCap, Code } from "lucide-react";
import { PhotoUploader } from "@/components/resume-builder/PhotoUploader";

export function Editor({ onBack }: { onBack: () => void }) {
  const { data, updateData, selectedTemplate, updateArrayItem, addArrayItem, removeArrayItem } = useResume();
  const previewRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${data.fullName.replace(" ", "_")}_Resume`,
  });

  const [atsScore, setAtsScore] = useState(85);

  const calculateAts = () => {
    // Simulated ATS Scoring logic
    let score = 50;
    if (data.summary.length > 50) score += 10;
    if (data.experience.length > 0) score += 15;
    if (data.education.length > 0) score += 10;
    if (data.projects.length > 0) score += 10;
    if (data.skills.split(',').length > 4) score += 5;
    setAtsScore(Math.min(100, score));
  };

  const RenderTemplate = () => {
    switch (selectedTemplate) {
      case "simple":
        return <SimpleTemplate innerRef={previewRef} />;
      case "modern":
        return <ModernTemplate innerRef={previewRef} />;
      case "creative":
        return <CreativeTemplate innerRef={previewRef} />;
      case "tech":
        return <TechInnovator innerRef={previewRef} />;
      case "executive":
        return <ExecutiveStyle innerRef={previewRef} />;
      case "compact":
        return <CompactATS innerRef={previewRef} />;
      case "dark_sidebar":
        return <DarkSidebar innerRef={previewRef} />;
      case "card":
        return <CardBased innerRef={previewRef} />;
      case "right_avatar":
        return <RightAvatar innerRef={previewRef} />;
      case "timeline":
        return <TimelineLayout innerRef={previewRef} />;
      case "vibrant":
        return <VibrantBanner innerRef={previewRef} />;
      case "code":
        return <CodeHacker innerRef={previewRef} />;
      default:
        return <SimpleTemplate innerRef={previewRef} />;
    }
  };

  return (
    <div className="flex flex-col h-screen -m-6 max-h-screen">
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
            &larr; Templates
          </Button>
          <div className="h-4 w-px bg-white/20"></div>
          <h2 className="text-white font-headline font-semibold flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-primary" />
            Resume Studio
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 rounded-full bg-black/40 border border-white/10 flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium tracking-wide">ATS SCORE</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${atsScore > 80 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : atsScore > 60 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
              {atsScore}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-primary hover:bg-primary/20 hover:text-white" onClick={calculateAts} title="Recalculate">
              <Sparkles className="h-3 w-3" />
            </Button>
          </div>
          <Button onClick={() => handlePrint()} className="bg-primary text-black hover:bg-blue-400 font-bold neon-glow transition-all">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Panel */}
        <div className="w-[450px] liquid-glass-card border-r border-white/10 overflow-y-auto as-scrollbar p-6 space-y-6 relative z-10 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5 pointer-events-none -z-10"></div>
          <Accordion type="multiple" defaultValue={["personal", "experience"]} className="space-y-4">
            <AccordionItem value="personal" className="border-white/10 glass rounded-2xl px-5 overflow-hidden shadow-lg hover:border-primary/30 transition-all duration-300 bg-white/5 backdrop-blur-md">
              <AccordionTrigger className="text-white font-bold hover:no-underline hover:text-primary transition-colors py-4">Personal Info</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Full Name" value={data.fullName} onChange={(e) => updateData("fullName", e.target.value)} className="bg-black/60 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-xl" />
                  <Input placeholder="Email" value={data.email} onChange={(e) => updateData("email", e.target.value)} className="bg-black/60 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-xl" />
                  <Input placeholder="Phone" value={data.phone} onChange={(e) => updateData("phone", e.target.value)} className="bg-black/60 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-xl" />
                  <Input placeholder="LinkedIn" value={data.linkedin} onChange={(e) => updateData("linkedin", e.target.value)} className="bg-black/60 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-xl" />
                  <Input placeholder="Website" value={data.website} onChange={(e) => updateData("website", e.target.value)} className="bg-black/60 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-xl col-span-2" />
                </div>
                <div className="p-1 bg-black/40 rounded-xl border border-white/5">
                   <PhotoUploader />
                </div>
                <Textarea placeholder="Professional Summary" value={data.summary} onChange={(e) => updateData("summary", e.target.value)} className="bg-black/60 border-white/10 text-white min-h-[100px] focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-xl" />
                <Textarea placeholder="Skills (comma separated)" value={data.skills} onChange={(e) => updateData("skills", e.target.value)} className="bg-black/60 border-white/10 text-white min-h-[60px] focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-xl" />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience" className="border-white/10 glass rounded-2xl px-5 overflow-hidden shadow-lg hover:border-blue-400/30 transition-all duration-300 bg-white/5 backdrop-blur-md">
              <AccordionTrigger className="text-white font-bold hover:no-underline border-b border-transparent hover:text-blue-400 transition-colors py-4">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" /> Experience</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4 pb-5">
                {data.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 bg-black/40 rounded-xl relative border border-white/10 group hover:border-blue-400/40 transition-colors shadow-inner">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-400 hover:bg-red-500/20 opacity-50 group-hover:opacity-100 transition-opacity" onClick={() => removeArrayItem("experience", index)}><Trash2 className="w-3 h-3" /></Button>
                    <div className="space-y-4 pr-8">
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Company" value={exp.company} onChange={(e) => updateArrayItem("experience", index, "company", e.target.value)} className="bg-black/60 border-white/10 text-white text-xs h-9 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 rounded-lg" />
                        <Input placeholder="Role" value={exp.role} onChange={(e) => updateArrayItem("experience", index, "role", e.target.value)} className="bg-black/60 border-white/10 text-white text-xs h-9 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 rounded-lg" />
                      </div>
                      <Input placeholder="Duration (e.g. 2021 - Present)" value={exp.duration} onChange={(e) => updateArrayItem("experience", index, "duration", e.target.value)} className="bg-black/60 border-white/10 text-white text-xs h-9 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 rounded-lg" />
                      <Textarea placeholder="Responsibilities/Bullet points" value={exp.description} onChange={(e) => updateArrayItem("experience", index, "description", e.target.value)} className="bg-black/60 border-white/10 text-white text-xs min-h-[80px] focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 rounded-lg" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-white/20 text-blue-300 hover:text-white hover:bg-blue-500/20 border-dashed rounded-xl h-10 transition-all font-semibold" onClick={() => addArrayItem("experience")}>
                  <Plus className="w-4 h-4 mr-2" /> Add Experience
                </Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="projects" className="border-white/10 glass rounded-2xl px-5 overflow-hidden shadow-lg hover:border-purple-400/30 transition-all duration-300 bg-white/5 backdrop-blur-md">
              <AccordionTrigger className="text-white font-bold hover:no-underline hover:text-purple-400 transition-colors py-4">
                <span className="flex items-center gap-2"><Code className="w-4 h-4 text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" /> Projects</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4 pb-5">
                {data.projects.map((proj, index) => (
                  <div key={proj.id} className="p-4 bg-black/40 rounded-xl relative border border-white/10 group hover:border-purple-400/40 transition-colors shadow-inner">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-400 hover:bg-red-500/20 opacity-50 group-hover:opacity-100 transition-opacity" onClick={() => removeArrayItem("projects", index)}><Trash2 className="w-3 h-3" /></Button>
                    <div className="space-y-4 pr-8">
                      <Input placeholder="Project Name" value={proj.name} onChange={(e) => updateArrayItem("projects", index, "name", e.target.value)} className="bg-black/60 border-white/10 text-white text-xs h-9 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 rounded-lg" />
                      <Input placeholder="Tech Stack" value={proj.techStack} onChange={(e) => updateArrayItem("projects", index, "techStack", e.target.value)} className="bg-black/60 border-white/10 text-white text-xs h-9 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 rounded-lg" />
                      <Textarea placeholder="Description" value={proj.description} onChange={(e) => updateArrayItem("projects", index, "description", e.target.value)} className="bg-black/60 border-white/10 text-white text-xs min-h-[80px] focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 rounded-lg" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/20 border-dashed rounded-xl h-10 transition-all font-semibold" onClick={() => addArrayItem("projects")}>
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="education" className="border-white/10 glass rounded-2xl px-5 overflow-hidden shadow-lg hover:border-emerald-400/30 transition-all duration-300 bg-white/5 backdrop-blur-md">
              <AccordionTrigger className="text-white font-bold hover:no-underline hover:text-emerald-400 transition-colors py-4">
                 <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" /> Education</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4 pb-5">
                {data.education.map((edu, index) => (
                  <div key={edu.id} className="p-4 bg-black/40 rounded-xl relative border border-white/10 group hover:border-emerald-400/40 transition-colors shadow-inner">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-400 hover:bg-red-500/20 opacity-50 group-hover:opacity-100 transition-opacity" onClick={() => removeArrayItem("education", index)}><Trash2 className="w-3 h-3" /></Button>
                    <div className="space-y-4 pr-8">
                      <Input placeholder="Institution" value={edu.institution} onChange={(e) => updateArrayItem("education", index, "institution", e.target.value)} className="bg-black/60 border-white/10 text-white text-xs h-9 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-lg" />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Degree" value={edu.degree} onChange={(e) => updateArrayItem("education", index, "degree", e.target.value)} className="bg-black/60 border-white/10 text-white text-xs h-9 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-lg" />
                        <Input placeholder="Year" value={edu.year} onChange={(e) => updateArrayItem("education", index, "year", e.target.value)} className="bg-black/60 border-white/10 text-white text-xs h-9 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-white/20 text-emerald-300 hover:text-white hover:bg-emerald-500/20 border-dashed rounded-xl h-10 transition-all font-semibold" onClick={() => addArrayItem("education")}>
                  <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Preview Panel */}
        <div className="flex-1 bg-[#050505] relative overflow-y-auto flex items-start justify-center py-12 px-8 shadow-[inset_20px_0_40px_rgba(0,0,0,0.8)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-50"></div>
          <div className="print-container scale-[0.8] origin-top md:scale-[0.85] lg:scale-[0.95] xl:scale-100 transition-transform relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <RenderTemplate />
          </div>
        </div>
      </div>
    </div>
  );
}
