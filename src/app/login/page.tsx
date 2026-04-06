"use client";

import Link from "next/link";
import { LineChart, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side: Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-blue-900/40 to-background border-r border-[#222]">
        <div className="max-w-md w-full px-12">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="bg-white rounded-md p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              <LineChart className="h-8 w-8 text-black" />
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-white">Placify</span>
          </Link>
          <div className="space-y-4">
            <h1 className="text-5xl font-headline font-bold text-white leading-tight">
              Predict. <br />
              <span className="text-primary neon-glow">Improve.</span> <br />
              Get Placed.
            </h1>
            <p className="text-gray-400 text-lg">
              The AI-powered platform designed to optimize your career trajectory and secure your dream role.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Subtle animated background blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="w-full max-w-md glass-card rounded-2xl p-8 neon-border transition-all duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
            <p className="text-gray-400">Log in to your account to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                className="w-full bg-[#111] border border-[#333] rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-[#111] border border-[#333] rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-primary text-black hover:bg-blue-400 font-bold text-base transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              Sign In
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center relative">
            <div className="absolute inset-x-0 h-[1px] bg-[#333]"></div>
            <span className="relative bg-[#0a0a0a] px-4 text-xs text-gray-500 uppercase">Or continue with</span>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full h-12 bg-[#111] border-[#333] hover:bg-[#222] text-white transition-colors">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
