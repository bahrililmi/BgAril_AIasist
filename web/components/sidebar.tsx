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
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

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
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Desktop Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setDesktopCollapsed(!desktopCollapsed)}
        className="hidden lg:flex fixed top-4 left-4 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
      >
        {desktopCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </Button>

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
          "fixed lg:static inset-y-0 left-0 z-40 flex h-screen flex-col border-r bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-all duration-300 ease-in-out",
          // Mobile behavior
          "lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop behavior
          desktopCollapsed ? "lg:w-20" : "lg:w-72",
          // Mobile width
          "w-72"
        )}
      >
        {/* Logo/Header */}
        <div className={cn(
          "flex h-16 items-center border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent transition-all duration-300",
          desktopCollapsed ? "lg:justify-center lg:px-2" : "gap-3 px-6"
        )}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 flex-shrink-0">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className={cn(
            "transition-all duration-300",
            desktopCollapsed ? "lg:hidden" : "block"
          )}>
            <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              AI Assistant
            </h1>
            <p className="text-xs text-muted-foreground">RMW Dashboard</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block"
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full transition-all duration-200",
                    desktopCollapsed ? "lg:justify-center lg:px-2" : "justify-start gap-3",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-semibold shadow-sm"
                  )}
                  title={desktopCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className={cn(
                    "transition-all duration-300",
                    desktopCollapsed ? "lg:hidden" : "block"
                  )}>
                    {item.name}
                  </span>
                  {isActive && !desktopCollapsed && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse lg:block hidden" />
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
            className={cn(
              "w-full transition-all duration-200 hover:bg-accent",
              desktopCollapsed ? "lg:justify-center lg:px-2" : "justify-start gap-3"
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={desktopCollapsed ? (theme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-all duration-300",
                  desktopCollapsed ? "lg:hidden" : "block"
                )}>
                  Light Mode
                </span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-all duration-300",
                  desktopCollapsed ? "lg:hidden" : "block"
                )}>
                  Dark Mode
                </span>
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className={cn(
              "w-full transition-all duration-200 text-destructive hover:bg-destructive/10 hover:text-destructive",
              desktopCollapsed ? "lg:justify-center lg:px-2" : "justify-start gap-3"
            )}
            title={desktopCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className={cn(
              "transition-all duration-300",
              desktopCollapsed ? "lg:hidden" : "block"
            )}>
              Logout
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
