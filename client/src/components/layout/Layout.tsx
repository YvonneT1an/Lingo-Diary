import { Link, useLocation } from "wouter";
import { PenSquare, BookMarked, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/", label: "Write", icon: PenSquare },
  { href: "/dictionary", label: "Dictionary", icon: BookMarked },
  { href: "/review", label: "Review", icon: GraduationCap },
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Desktop Top Navbar */}
      <header className="hidden md:flex items-center justify-between h-16 px-8 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">
            LingoDiary
          </h1>
        </div>
        
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium shadow-sm shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 w-full max-w-4xl mx-auto pb-20 md:pb-8 pt-0 md:pt-8 px-0 md:px-4">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center h-14 px-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-xl font-bold text-primary">
            LingoDiary
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/90 backdrop-blur-xl z-20 pb-safe">
        <div className="flex items-center justify-around h-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-full transition-all duration-200",
                  isActive && "bg-primary/20"
                )}>
                  <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
