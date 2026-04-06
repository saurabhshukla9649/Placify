import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LineChart, ArrowRight, ShieldCheck, Zap, Globe, Github, Star, Search, Command } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground font-body selection:bg-primary/30 transparent-bg-wrapper">
      
      {/* Top Announcement Banner */}
      <div className="w-full bg-blue-600/90 backdrop-blur-sm text-white text-sm font-medium py-2 px-4 flex items-center justify-center gap-2 hover:bg-blue-500/90 transition-colors cursor-pointer border-b border-primary/20">
        <span>🎉 We just launched Placify 2.0!</span>
        <span className="opacity-80 hidden sm:inline">- The ultimate AI career copilot.</span>
        <ArrowRight className="h-4 w-4 ml-1" />
      </div>

      {/* Navbar */}
      <header className="px-6 lg:px-12 h-16 flex items-center justify-between border-b border-white/5 glass sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-6">
          <Link className="flex items-center gap-2 group" href="/">
            <div className="bg-white/10 rounded-md p-1 border border-white/20 group-hover:bg-white/20 transition-all neon-glow">
              <LineChart className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">Placify</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link className="hover:text-white transition-colors" href="#">Docs</Link>
            <Link className="hover:text-white transition-colors" href="#">Features</Link>
            <Link className="hover:text-white transition-colors" href="#">Showcase</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 glass border border-white/10 rounded-md text-sm text-gray-400 w-64 hover:border-white/20 transition-colors cursor-text group hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Search className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span className="flex-1 group-hover:text-gray-300 transition-colors">Search skills, jobs...</span>
            <span className="flex items-center gap-1 text-xs bg-black/40 px-1.5 py-0.5 rounded border border-white/10 text-gray-500">
              <Command className="h-3 w-3" /> K
            </span>
          </div>
          <Link href="https://github.com" target="_blank" className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Github className="h-5 w-5" />
            <span>Star on GitHub</span>
          </Link>
          <Link href="/login">
            <Button size="sm" variant="ghost" className="hidden md:inline-flex text-gray-300 hover:text-white hover:bg-white/5">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="rounded-md bg-primary text-black hover:bg-blue-400 font-bold px-4 neon-glow transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center">
        {/* Decorative central flare */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
        
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 flex flex-col items-center justify-center text-center px-4 relative z-10">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-blue-300 mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-float">
            <Star className="h-4 w-4 mr-2 text-primary" /> Introducing the ATS Analysis Engine v3
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight relative">
            Analyze and Improve Your <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">Placement Probability</span>
          </h1>
          <p className="mt-8 max-w-[650px] text-lg text-gray-300 md:text-xl font-medium leading-relaxed drop-shadow-md">
            The open-source AI platform for students to track skill gaps, optimize resumes for ATS, and master communication skills. Build your career with confidence.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-md bg-primary text-black hover:bg-cyan-400 font-bold h-12 px-8 text-base w-full sm:w-auto neon-glow transform transition-transform hover:scale-105">
                Start for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
              <Button size="lg" variant="outline" className="rounded-md border-white/10 glass hover:bg-white/10 hover:border-white/20 text-white font-semibold h-12 px-8 w-full sm:w-auto transform transition-transform hover:scale-105 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <Github className="mr-2 h-5 w-5" /> Give it a star
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Cards Showcase */}
        <section className="w-full py-20 relative z-10">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="mb-16 flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 drop-shadow-sm">Core Capabilities</h2>
              <p className="text-gray-400 text-lg max-w-2xl">Everything you need to secure your dream role, powered by advanced artificial intelligence layers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="group liquid-glass-card rounded-2xl p-8 overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-black/40 border border-white/10 group-hover:border-primary/50 transition-colors shadow-inner">
                   <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity flex"></div>
                   <ShieldCheck className="h-7 w-7 text-primary relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">ATS Resume Audit</h3>
                <p className="text-gray-400 leading-relaxed text-sm relative z-10 flex-1">
                  Instant analysis for keywords, formatting, and industry standards to beat the bots and get your resume seen by actual humans.
                </p>
              </div>
              
              <div className="group liquid-glass-card rounded-2xl p-8 overflow-hidden flex flex-col" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-black/40 border border-white/10 group-hover:border-cyan-500/50 transition-colors shadow-inner">
                   <div className="absolute inset-0 bg-cyan-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <Zap className="h-7 w-7 text-cyan-400 relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Placement Scoring</h3>
                <p className="text-gray-400 leading-relaxed text-sm relative z-10 flex-1">
                  Proprietary algorithm predicts your likelihood of getting placed based on current market demand and your specific skill set.
                </p>
              </div>

              <div className="group liquid-glass-card rounded-2xl p-8 overflow-hidden flex flex-col" style={{ animationDelay: '0.4s' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-black/40 border border-white/10 group-hover:border-purple-500/50 transition-colors shadow-inner">
                   <div className="absolute inset-0 bg-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <Globe className="h-7 w-7 text-purple-400 relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Communication Coach</h3>
                <p className="text-gray-400 leading-relaxed text-sm relative z-10 flex-1">
                  Record your practice sessions and get real-time feedback on confidence, fluency, clarity, and body language.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full glass border-t border-white/5 py-8 mt-auto relative z-10 shadow-[0_-4px_30px_rgba(0,0,0,0.2)]">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-500 font-medium">© 2024 Placify. Open source intelligence.</p>
          </div>
          <div className="flex gap-6">
            <Link className="text-sm text-gray-500 hover:text-white transition-colors" href="#">Terms</Link>
            <Link className="text-sm text-gray-500 hover:text-white transition-colors" href="#">Privacy</Link>
            <Link className="text-sm text-gray-500 hover:text-white transition-colors" href="https://github.com/placify" target="_blank">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}