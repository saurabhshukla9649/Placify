"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { identifySkillGapsAndRecommendPaths, IdentifySkillGapsAndRecommendPathsOutput } from "@/ai/flows/identify-skill-gaps-and-recommend-paths";
import { Loader2, Target, BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UiverseLoader } from "@/components/ui/uiverse-loader";

export default function SkillsPage() {
  const [targetRole, setTargetRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IdentifySkillGapsAndRecommendPathsOutput | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!targetRole.trim() || !currentSkills.trim()) {
      toast({
        title: "Fields Required",
        description: "Please enter both your target role and current skills.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const skillsArray = currentSkills.split(",").map(s => s.trim()).filter(Boolean);
      const output = await identifySkillGapsAndRecommendPaths({ 
        jobRole: targetRole,
        userSkills: skillsArray
      });
      
      if (output && 'error' in output) {
         toast({
            title: "Analysis Error",
            description: (output as { error: string }).error,
            variant: "destructive",
         });
         return;
      }

      setResults(output as IdentifySkillGapsAndRecommendPathsOutput);
      localStorage.setItem('placify_skill_gaps', JSON.stringify(output));
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not identify skill gaps at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Skill Gap Analyzer</h1>
        <p className="text-gray-400 mt-2">Compare your current stack against industry requirements for your dream job.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel: Input Form */}
        <div className="glass-card rounded-2xl border border-white/5 h-fit overflow-hidden lg:col-span-1">
          <div className="p-6 border-b border-white/10 bg-black/40">
            <h2 className="text-xl font-headline font-bold text-white tracking-wide">Target Profiling</h2>
            <p className="text-sm text-gray-400 mt-1">Tell us what you know and what you want to be.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <label htmlFor="role" className="text-sm font-medium text-gray-300 uppercase tracking-widest text-[10px]">Target Job Role</label>
              <input 
                id="role" 
                className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all shadow-inner"
                placeholder="e.g. AI Engineer, Product Manager" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="skills" className="text-sm font-medium text-gray-300 uppercase tracking-widest text-[10px]">Current Skills (Comma Separated)</label>
              <textarea 
                id="skills" 
                className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all min-h-[120px] resize-y shadow-inner"
                placeholder="e.g. Python, TensorFlow, SQL" 
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
              />
            </div>
            <Button 
              className="w-full h-14 text-base bg-orange-500 text-black hover:bg-orange-400 font-bold shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all rounded-xl" 
              onClick={handleAnalyze} 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Target className="mr-2 h-5 w-5" />}
              Identify Skill Gaps
            </Button>
          </div>
        </div>

        {/* Right Panel: Results & Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {!results && !isLoading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-dashed border-white/10">
              <BookOpen className="h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-headline font-semibold text-white">Your Learning Path Awaits</h3>
              <p className="text-sm text-gray-400 max-w-xs mt-2 leading-relaxed">
                Fill in your details to get an AI-generated, structured roadmap of skills you need to acquire to land your target role.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[400px] flex items-center justify-center glass-card rounded-2xl border border-white/5">
               <UiverseLoader text="MAPPING" />
            </div>
          )}

          {results && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Missing Skills Badges */}
              <div className="glass-card rounded-2xl border-t-4 border-t-red-500 overflow-hidden hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all">
                <div className="p-6">
                  <h3 className="text-lg font-headline font-bold text-white mb-2">Critical Skill Gaps</h3>
                  <p className="text-sm text-gray-400 mb-6">Essential skills for {targetRole} currently missing from your profile.</p>
                  
                  <div className="flex flex-wrap gap-3">
                    {results.skillGaps.map((gap, i) => (
                      <span key={i} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/30 text-sm font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                <h2 className="text-2xl font-headline font-bold flex items-center gap-2 text-white">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Recommended Roadmap
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
              </div>

              {/* Learning Roadmap Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Connecting line for visual effect */}
                <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/5 hidden md:block -z-10"></div>
                
                {results.recommendedLearningPaths.map((path, i) => (
                  <div key={i} className="glass-card rounded-2xl border border-white/10 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] flex flex-col group overflow-hidden">
                    <div className="bg-primary/5 border-b border-primary/10 p-5 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
                      <h3 className="text-lg font-headline font-bold text-white relative z-10">{path.skill}</h3>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 relative z-10 leading-relaxed">{path.importance}</p>
                    </div>
                    
                    <div className="flex-1 p-5 flex flex-col justify-between bg-white/5">
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase text-primary tracking-[0.2em]">Top Resources</p>
                        <div className="space-y-2">
                          {path.resources.map((res, j) => (
                            <div key={j} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/20 hover:bg-black/40 transition-all cursor-pointer shadow-inner">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="h-8 w-8 rounded-md bg-white/5 flex items-center justify-center text-gray-300 font-bold border border-white/10 text-xs shrink-0 group-hover:text-primary transition-colors">
                                  {res.type[0].toUpperCase()}
                                </div>
                                <div className="min-w-0 pr-2">
                                  <p className="text-sm font-medium text-white truncate">{res.name}</p>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{res.type}</p>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-primary shrink-0 transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
