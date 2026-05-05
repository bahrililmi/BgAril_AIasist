"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Bot, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "AI Query", href: "/ai-query", icon: Bot },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 flex h-screen w-72 flex-col border-r bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo/Header */}
        <div className="flex h-16 items-center gap-3 border-b px-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              AI Assistant
            </h1>
            <p className="text-xs text-muted-foreground">RMW Dashboard</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 transition-all duration-200",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-semibold shadow-sm"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t p-3 space-y-2 bg-muted/30">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-accent"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-5 w-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                <span>Dark Mode</span>
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
}
