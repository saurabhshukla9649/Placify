"use client";

import { useState } from "react";
import { User, Bell, Shield, CreditCard, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account preferences, notifications, and subscription details.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 space-y-2 shrink-0">
          {[
             { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
             { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
             { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
             { id: "billing", label: "Billing & Plans", icon: <CreditCard className="h-4 w-4" /> },
          ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  activeTab === tab.id 
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
             >
                {tab.icon}
                {tab.label}
             </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card rounded-2xl border border-white/5 overflow-hidden">
          
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="p-6 border-b border-white/10 bg-white/5">
                  <h2 className="text-xl font-headline font-bold text-white">Public Profile</h2>
                  <p className="text-sm text-gray-400 mt-1">This is how others will see you on the platform.</p>
               </div>
               
               <div className="p-6 space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary text-2xl font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      JD
                    </div>
                    <div className="space-y-2">
                       <Button variant="outline" className="glass border-white/10 text-white hover:bg-white/10">Change Avatar</Button>
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <hr className="border-white/5" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-gray-400">First Name</label>
                       <input className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-primary focus:border-transparent transition-all shadow-inner" defaultValue="John" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Last Name</label>
                       <input className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-primary focus:border-transparent transition-all shadow-inner" defaultValue="Doe" />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                    <input className="w-full bg-black/40 border border-white/5 rounded-md px-4 py-3 text-gray-500 cursor-not-allowed shadow-inner" defaultValue="john.doe@example.com" disabled />
                    <p className="text-xs text-gray-500">Contact support to change your email address.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Bio</label>
                    <textarea 
                      className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-primary focus:border-transparent transition-all min-h-[100px] resize-y shadow-inner" 
                      defaultValue="Passionate frontend engineer looking to break into big tech."
                    />
                  </div>
               </div>

               <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
                   <Button className="bg-primary text-black hover:bg-blue-400 font-bold neon-glow px-8 h-12">
                     <Save className="mr-2 h-4 w-4" /> Save Changes
                   </Button>
               </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="p-6 border-b border-white/10 bg-white/5">
                  <h2 className="text-xl font-headline font-bold text-white">Security</h2>
                  <p className="text-sm text-gray-400 mt-1">Manage your password and authentication methods.</p>
               </div>
               
               <div className="p-6 space-y-6">
                  <div className="space-y-4">
                     <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Password</label>
                       <input type="password" className="w-full max-w-md bg-black/20 border border-white/10 shadow-inner rounded-md px-4 py-3 text-white focus:ring-1 focus:ring-purple-500 transition-all" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-gray-400">New Password</label>
                       <input type="password" className="w-full max-w-md bg-black/20 border border-white/10 shadow-inner rounded-md px-4 py-3 text-white focus:ring-1 focus:ring-purple-500 transition-all" />
                     </div>
                     <Button className="bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] mt-4">Update Password</Button>
                  </div>
                  
                  <hr className="border-white/5" />
                  
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400 mb-4">Add an extra layer of security to your account.</p>
                    <Button variant="outline" className="glass border-white/10 text-white hover:bg-white/10">Enable 2FA</Button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="p-6 border-b border-white/10 bg-white/5">
                  <h2 className="text-xl font-headline font-bold text-white">Notifications</h2>
                  <p className="text-sm text-gray-400 mt-1">Choose what you want to be notified about.</p>
               </div>
               
               <div className="p-6 space-y-6">
                  {[
                    { title: "Interview Reminders", desc: "Get notified when you have a scheduled mock interview.", active: true },
                    { title: "Weekly Progress Report", desc: "Receive a weekly summary of your skill improvements.", active: true },
                    { title: "New Opportunities", desc: "Alert me when jobs matching my skill gaps appear.", active: false },
                    { title: "Platform Updates", desc: "News about new features and improvements to Placify.", active: true }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20 shadow-inner">
                       <div>
                         <p className="font-bold text-white">{notif.title}</p>
                         <p className="text-sm text-gray-400">{notif.desc}</p>
                       </div>
                       <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notif.active ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-white/10 border border-white/5'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notif.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="p-6 border-b border-white/10 bg-white/5">
                  <h2 className="text-xl font-headline font-bold text-white">Billing & Plans</h2>
                  <p className="text-sm text-gray-400 mt-1">Manage your active subscription.</p>
               </div>
               
               <div className="p-6 space-y-6">
                  <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden shadow-inner">
                     <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           {/* Using React component name for Badge which is auto-imported, so no need to change here but I will check later if it causes error */}
                           <Badge className="bg-primary text-black font-bold mb-2 border-none px-3 py-1 uppercase tracking-widest text-[10px]">Active Plan</Badge>
                           <h3 className="text-3xl font-headline font-bold text-white">Pro Tier</h3>
                           <p className="text-sm text-gray-400 mt-1">$29/month. Next billing date: Oct 14, 2026</p>
                        </div>
                        <div className="text-4xl font-headline font-bold text-white opacity-20">★</div>
                     </div>
                     <div className="flex gap-4">
                        <Button className="bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.4)] font-bold">Manage Subscription</Button>
                        <Button variant="outline" className="border-white/10 text-gray-300 hover:text-white glass hover:bg-white/5">View Invoices</Button>
                     </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20 shadow-inner">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-black/40 rounded flex items-center justify-center border border-white/10">
                             <div className="flex -space-x-2">
                               <div className="w-4 h-4 rounded-full bg-red-500/80 mix-blend-screen"></div>
                               <div className="w-4 h-4 rounded-full bg-orange-500/80 mix-blend-screen"></div>
                             </div>
                          </div>
                          <div>
                            <p className="font-bold text-white">•••• •••• •••• 4242</p>
                            <p className="text-xs text-gray-500">Expires 12/28</p>
                          </div>
                       </div>
                       <Button variant="ghost" className="text-primary hover:text-blue-400 hover:bg-primary/10">Edit</Button>
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
