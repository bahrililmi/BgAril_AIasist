import { Sidebar } from "@/components/sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full lg:ml-0">
        <div className="lg:pl-16">
          {children}
        </div>
      </main>
    </div>
  );
}
