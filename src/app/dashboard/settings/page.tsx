"use client";

import { useState } from "react";
import { User, Bell, Shield, CreditCard, Save, ShieldCheck, Mail, Camera, Key, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <header className="relative">
        <div className="absolute -left-8 -top-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-4xl font-headline font-bold text-white tracking-tight relative z-10">Account Settings</h1>
        <p className="text-gray-400 mt-2 relative z-10">Manage your profile, security preferences, and active subscriptions.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 space-y-2 shrink-0">
          {[
             { id: "profile", label: "Public Profile", icon: <User className="h-4 w-4" />, desc: "Avatar, Name & Bio" },
             { id: "security", label: "Security & Access", icon: <Shield className="h-4 w-4" />, desc: "Passwords & 2FA" },
             { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" />, desc: "Email & Alerts" },
             { id: "billing", label: "Billing & Plans", icon: <CreditCard className="h-4 w-4" />, desc: "Subscription status" },
          ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all text-left group overflow-hidden relative ${
                  activeTab === tab.id 
                    ? "bg-white/10 text-white border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-primary/50" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
             >
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50 pointer-events-none"></div>
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`p-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-primary text-black shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                    {tab.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{tab.label}</h3>
                    <p className={`text-xs ${activeTab === tab.id ? 'text-gray-300' : 'text-gray-500'}`}>{tab.desc}</p>
                  </div>
                </div>
             </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl bg-black/40 backdrop-blur-3xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 relative z-10">
               <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                  <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Public Profile</h2>
                  <p className="text-sm text-gray-400 mt-2">Customize how you appear to others on Placify.</p>
               </div>
               
               <div className="p-8 space-y-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <Avatar className="h-24 w-24 border-2 border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-4 ring-black">
                        <AvatarFallback className="bg-gradient-to-br from-primary/40 to-purple-600/40 text-2xl font-bold text-white">JD</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-sm font-semibold text-white">Profile Picture</h3>
                       <div className="flex gap-3">
                         <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10 shadow-sm transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                           Upload New
                         </Button>
                         <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                           Remove
                         </Button>
                       </div>
                       <p className="text-xs text-gray-500 mt-1">Recommended: Square JPG, PNG, or GIF, at least 400x400px.</p>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <Label className="text-gray-300">First Name</Label>
                       <Input className="bg-black/30 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl transition-all hover:bg-black/40" defaultValue="John" />
                     </div>
                     <div className="space-y-2">
                       <Label className="text-gray-300">Last Name</Label>
                       <Input className="bg-black/30 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl transition-all hover:bg-black/40" defaultValue="Doe" />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Email Address</Label>
                      <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</Badge>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input className="pl-11 bg-black/30 border-white/10 text-gray-400 cursor-not-allowed h-12 rounded-xl" defaultValue="john.doe@example.com" disabled />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Your email address is used for strictly account-related communications.</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Bio</Label>
                    <Textarea 
                      className="bg-black/30 border-white/10 text-white focus-visible:ring-primary min-h-[120px] rounded-xl transition-all hover:bg-black/40 resize-none px-4 py-3" 
                      defaultValue="Passionate frontend engineer looking to break into big tech. Specialized in React, Next.js, and crafting beautiful user interfaces."
                    />
                    <p className="text-xs text-gray-500 text-right">138/500 characters</p>
                  </div>
               </div>

               <div className="p-8 border-t border-white/5 bg-black/20 flex gap-4 justify-end rounded-b-3xl">
                   <Button variant="ghost" className="text-gray-400 hover:text-white">Cancel</Button>
                   <Button className="bg-primary text-black hover:bg-blue-400 font-bold neon-glow px-8 rounded-xl h-12 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                     <Save className="mr-2 h-4 w-4" /> Save Changes
                   </Button>
               </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 relative z-10">
               <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                  <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Security & Access</h2>
                  <p className="text-sm text-gray-400 mt-2">Manage your password and robust authentication settings.</p>
               </div>
               
               <div className="p-8 space-y-10">
                  <div className="space-y-6 max-w-xl">
                     <h3 className="text-xl font-semibold text-white flex items-center gap-2"><Key className="w-5 h-5 text-primary" /> Change Password</h3>
                     <div className="space-y-4">
                       <div className="space-y-2">
                         <Label className="text-gray-300">Current Password</Label>
                         <Input type="password" placeholder="••••••••••••" className="bg-black/30 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl" />
                       </div>
                       <div className="space-y-2">
                         <Label className="text-gray-300">New Password</Label>
                         <Input type="password" placeholder="••••••••••••" className="bg-black/30 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl" />
                       </div>
                       <div className="space-y-2">
                         <Label className="text-gray-300">Confirm New Password</Label>
                         <Input type="password" placeholder="••••••••••••" className="bg-black/30 border-white/10 text-white focus-visible:ring-primary h-12 rounded-xl" />
                       </div>
                       <Button className="bg-purple-600/80 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] rounded-xl mt-2 border border-purple-500/50 h-10 px-6">
                         Update Password
                       </Button>
                     </div>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4"><ShieldCheck className="w-5 h-5 text-green-400" /> Two-Factor Authentication (2FA)</h3>
                    <div className="p-6 border border-white/10 bg-white/5 rounded-2xl flex flex-col md:flex-row gap-6 items-center justify-between group hover:border-white/20 transition-all">
                       <div>
                         <p className="text-base text-gray-200 mb-1 font-medium">Protect your account with an extra layer of security.</p>
                         <p className="text-sm text-gray-500 leading-relaxed max-w-md">Once configured, you'll be required to enter both your password and an authentication code from your mobile phone in order to sign in.</p>
                       </div>
                       <Button variant="outline" className="glass border-primary/50 text-white hover:bg-primary/20 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.15)] text-primary font-semibold h-11 px-5">Enable App 2FA</Button>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 relative z-10">
               <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                  <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Notification Preferences</h2>
                  <p className="text-sm text-gray-400 mt-2">Control the emails and alerts you receive from Placify.</p>
               </div>
               
               <div className="p-8 space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Email Notifications</h3>
                    
                    <div className="space-y-4">
                      {[
                        { id: "interview", title: "Interview Reminders", desc: "Get notified when you have a scheduled mock interview or feedback is ready." },
                        { id: "progress", title: "Weekly Progress Report", desc: "Receive a personalized weekly summary of your skill improvements and AI recommendations." },
                        { id: "opportunities", title: "New Opportunities", desc: "Alert me when jobs highly matching my current skill profile open up." },
                        { id: "marketing", title: "Product Updates & News", desc: "Occasional news about new features, templates, and company updates." }
                      ].map((notif, i) => (
                        <div key={notif.id} className="flex items-start justify-between p-5 rounded-2xl border border-white/5 bg-black/20 hover:bg-black/30 transition-all shadow-inner group">
                           <div className="pr-8">
                             <Label htmlFor={notif.id} className="font-semibold text-white text-base cursor-pointer mb-1 block">{notif.title}</Label>
                             <p className="text-sm text-gray-400 leading-relaxed">{notif.desc}</p>
                           </div>
                           <Switch id={notif.id} defaultChecked={i !== 2} className="mt-1 data-[state=checked]:bg-primary" />
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 relative z-10">
               <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                  <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Billing & Subscriptions</h2>
                  <p className="text-sm text-gray-400 mt-2">Manage your current plan, payment methods, and billing history.</p>
               </div>
               
               <div className="p-8 space-y-8">
                  {/* Current Plan Card */}
                  <div className="bg-gradient-to-br from-black/60 to-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                     <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
                     
                     <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
                        <div>
                           <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 mb-4 px-3 py-1 font-semibold uppercase tracking-widest text-[10px]">Current Plan</Badge>
                           <h3 className="text-4xl font-headline font-bold text-white mb-2 flex items-center gap-3">
                             Pro Tier <Badge className="bg-gradient-to-r from-amber-200 to-yellow-400 text-black border-none h-6 hidden md:flex font-bold">PREMIUM</Badge>
                           </h3>
                           <p className="text-gray-400 flex flex-wrap items-center gap-2">
                             <span className="font-mono text-white text-lg">$29.00</span> / month
                             <span className="text-white/20 mx-2">•</span>
                             Renews on <span className="text-white font-medium">October 14, 2026</span>
                           </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                           <Button className="bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-bold rounded-xl transition-transform hover:scale-105 h-12 px-6">
                             Upgrade Plan
                           </Button>
                           <Button variant="outline" className="border-white/10 text-white glass hover:bg-white/10 rounded-xl h-12 px-6 font-semibold">
                             Cancel Subscription
                           </Button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Payment Method */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Payment Method</h3>
                      <div className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-black/40 hover:bg-black/60 transition-all shadow-inner group cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-10 bg-black rounded-md flex items-center justify-center border border-white/10 shadow-lg relative overflow-hidden">
                               <div className="flex -space-x-2">
                                 <div className="w-5 h-5 rounded-full bg-[#ea001b] mix-blend-screen opacity-90 relative z-10"></div>
                                 <div className="w-5 h-5 rounded-full bg-[#f79e1b] mix-blend-screen opacity-90 relative"></div>
                               </div>
                            </div>
                            <div>
                              <p className="font-semibold text-white font-mono tracking-wider">•••• 4242</p>
                              <p className="text-xs text-gray-500">Expires 12/28</p>
                            </div>
                         </div>
                         <Button variant="ghost" className="text-gray-400 hover:text-white shrink-0 group-hover:bg-white/10">Edit</Button>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end mb-4">
                        <h3 className="text-lg font-semibold text-white">Billing History</h3>
                        <Button variant="link" className="text-primary h-auto p-0 text-sm hover:text-blue-400">View All</Button>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { date: "Oct 14, 2026", amount: "$29.00", status: "Paid" },
                          { date: "Sep 14, 2026", amount: "$29.00", status: "Paid" }
                        ].map((invoice, i) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/20">
                                <Check className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm text-white font-medium">{invoice.date}</p>
                                <p className="text-xs text-gray-500">Invoice #INV-{1042 + i}</p>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              <p className="text-sm font-semibold text-white">{invoice.amount}</p>
                              <Button variant="ghost" className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-white h-auto p-0 opacity-0 group-hover:opacity-100 transition-opacity">PDF</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
