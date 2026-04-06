import { DashboardNav } from "@/components/dashboard-nav";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden selection:bg-primary/30 transparent-bg-wrapper">
      <aside className="w-64 glass border-r border-white/5 hidden md:block z-10 flex-shrink-0">
        <DashboardNav />
      </aside>
      
      <main className="flex-1 overflow-y-auto w-full relative z-0 as-scrollbar">
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 md:pt-10 space-y-8 min-h-full">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}