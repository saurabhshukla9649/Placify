"use client";

import Link from "next/link";
import { LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-background flex-row-reverse">
      {/* Left side (Visual/Branding) - Flipped for Signup */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gradient-to-bl from-blue-900/40 to-background border-l border-[#222]">
        <div className="max-w-md w-full px-12">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="bg-white rounded-md p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              <LineChart className="h-8 w-8 text-black" />
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-white">Placify</span>
          </Link>
          <div className="space-y-4">
            <h1 className="text-5xl font-headline font-bold text-white leading-tight">
              Your Career. <br />
              <span className="text-primary neon-glow">Supercharged.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Join thousands of students who are taking control of their placement journey with AI.
            </p>
          </div>
        </div>
      </div>

      {/* Right side (Auth Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="w-full max-w-md glass-card rounded-2xl p-8 neon-border transition-all duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-gray-400">Sign up and start your journey</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="name">Full Name</label>
              <input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                className="w-full bg-[#111] border border-[#333] rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
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
              <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-[#111] border border-[#333] rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-primary text-black hover:bg-blue-400 font-bold text-base transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              Sign Up
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
