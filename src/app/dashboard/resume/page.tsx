"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { analyzeResumeForImprovement, AnalyzeResumeForImprovementOutput } from "@/ai/flows/analyze-resume-for-improvement";
import { Loader2, Upload, CheckCircle2, AlertCircle, Sparkles, FileText, FileUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { UiverseLoader } from "@/components/ui/uiverse-loader";

// Set up PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export default function ResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [results, setResults] = useState<AnalyzeResumeForImprovementOutput | null>(null);
  const [previousResults, setPreviousResults] = useState<AnalyzeResumeForImprovementOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const processFile = async (file?: File) => {
    if (!file) return;

    setIsParsing(true);
    try {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result;
          if (typeof content === "string") {
            setResumeText(content);
            if (results) setResults(null);
            toast({ title: "File Imported", description: `Loaded text from ${file.name}` });
          }
        };
        reader.readAsText(file);
      } else if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        
        setResumeText(fullText.trim());
        if (results) setResults(null);
        toast({ title: "PDF Imported", description: `Extracted text from ${file.name}` });
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value.trim());
        if (results) setResults(null);
        toast({ title: "Word Document Imported", description: `Extracted text from ${file.name}` });
      } else {
        toast({
          title: "Unsupported Format",
          description: "Please upload a .txt, .pdf, or .docx file.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Import Error",
        description: "Could not read the file correctly. Make sure it's a valid document.",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || resumeText.trim().length === 0) {
      toast({
        title: "Missing input",
        description: "Please upload or paste your resume first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const output = await analyzeResumeForImprovement({ resumeText });
      
      if (output && 'error' in output) {
         toast({
            title: "Analysis Error",
            description: output.error,
            variant: "destructive",
         });
         return;
      }

      if (results) setPreviousResults(results);
      setResults(output as AnalyzeResumeForImprovementOutput);
      localStorage.setItem('placify_resume_analysis', JSON.stringify(output));
      toast({ 
         title: "Live Analysis Completed", 
         description: "Successfully processed and dynamically scored the provided raw content based on current standards.",
         className: "border-primary bg-black text-white" 
      });
    } catch (error: any) {
      console.error("Resume Analysis Catch:", error);
      toast({
        title: "Analysis failed",
        description: error?.message || "Could not process your resume at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Resume ATS Analyzer</h1>
        <p className="text-gray-400 mt-2">Evaluate how well your resume performs against modern applicant tracking systems.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Upload & Input area */}
        <div className="glass-card rounded-2xl p-6 h-fit border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Resume Content
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md glass border-white/10 text-gray-300 hover:text-white"
              disabled={isParsing}
            >
              {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" /> : <FileUp className="mr-2 h-4 w-4 text-primary" />}
              Select File
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".txt,.pdf,.docx"
            />
          </div>
          
          <p className="text-sm text-gray-400">Drag and drop your resume (PDF, Word, TXT) below, or paste the text directly.</p>

          <div className="space-y-2">
            <Label htmlFor="resume" className="sr-only">Resume Text</Label>
            <div 
              onDrop={handleDrop} 
              onDragOver={(e) => e.preventDefault()}
              className="relative rounded-xl border border-dashed border-white/20 hover:border-primary/50 transition-colors bg-white/5 overflow-hidden"
            >
              <Textarea 
                id="resume"
                placeholder="Paste your resume content here or upload a file..."
                className="min-h-[350px] resize-y font-mono text-sm bg-transparent border-none text-gray-300 focus-visible:ring-0 placeholder:text-gray-600 p-4"
                value={resumeText}
                onChange={(e) => {
                  if (resumeText !== e.target.value && results) setResults(null);
                  setResumeText(e.target.value);
                }}
              />
              {!resumeText && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-500">
                  <Upload className="h-8 w-8 mb-2 opacity-50" />
                  <span>Drag & Drop File Here</span>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            className="w-full h-14 text-lg bg-primary text-black hover:bg-blue-400 font-bold neon-glow transition-all rounded-xl" 
            onClick={handleAnalyze} 
            disabled={isLoading || isParsing}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Run AI Audit
              </>
            )}
          </Button>
        </div>

        {/* Right Side: Analysis Results */}
        <div className="space-y-6">
          {!results && !isLoading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-dashed border-white/10">
              <Upload className="h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-headline font-semibold text-white">No Analysis Results</h3>
              <p className="text-sm text-gray-400 max-w-xs mt-2">
                Import or paste your resume and run the audit to see your ATS score, keywords, and formatting feedback.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[400px] flex items-center justify-center glass-card rounded-2xl border border-white/5 bg-black/50">
               <div className="flex flex-col items-center gap-6">
                 <UiverseLoader text="ANALYZING RESUME" />
                 <p className="text-sm text-gray-400 animate-pulse">Running semantic analysis on content...</p>
               </div>
            </div>
          )}

          {results && (
            <>
              {/* ATS Score Output */}
              <div className="glass-card rounded-2xl border-t-4 border-t-primary overflow-hidden hover:neon-border transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-white">Overall ATS Score</span>
                      <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md border ${(results as any).confidenceLevel === "High" ? "bg-green-500/10 text-green-400 border-green-500/20" : (results as any).confidenceLevel === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                        {(results as any).confidenceLevel} Confidence
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-4xl font-headline font-bold text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">{results.atsScore}%</span>
                      {previousResults && (
                        <span className={`text-xs font-bold ${results.atsScore > previousResults.atsScore ? "text-green-400" : results.atsScore < previousResults.atsScore ? "text-red-400" : "text-gray-400"}`}>
                          {results.atsScore > previousResults.atsScore ? "↑" : results.atsScore < previousResults.atsScore ? "↓" : "No change"} {Math.abs(results.atsScore - previousResults.atsScore)}{results.atsScore !== previousResults.atsScore && "%"}
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={results.atsScore} className="h-3 mb-4 bg-gray-800" />
                  <p className="text-sm text-gray-400">
                    {results.atsScore > 80 
                      ? "Excellent! Your resume is highly optimized for recruitment systems." 
                      : results.atsScore > 60 
                        ? "Good, but there is room for keyword and formatting improvements." 
                        : "Warning: Your resume may be filtered out by automated systems."}
                  </p>
                </div>
              </div>

              {/* Missing Keywords Output */}
              <div className="glass-card rounded-2xl border border-amber-500/20 p-6 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
                <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.missingKeywords.length > 0 ? (
                    results.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20 text-sm font-medium">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">No critical missing keywords found.</p>
                  )}
                </div>
              </div>

              {/* Formatting Issues Output */}
              <div className="glass-card rounded-2xl border border-red-500/20 p-6 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all">
                <h3 className="text-lg font-headline font-bold text-white mb-4">Formatting Issues</h3>
                <div className="space-y-3">
                  {results.formattingIssues.map((issue, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-300">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0 neon-glow" />
                      <p>{issue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Suggestions Output */}
              <div className="glass-card rounded-2xl border border-primary/30 p-6 bg-primary/5 hover:neon-border transition-all">
                <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  AI Suggestions
                </h3>
                <div className="space-y-4">
                  {results.suggestions.map((sug, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm leading-relaxed text-gray-300 shadow-inner">
                      {sug}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
