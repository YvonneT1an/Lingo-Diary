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
    <div className="flex flex-col min-h-[100dvh] bg-background md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-sm px-4 py-8 shrink-0">
        <div className="mb-8 px-4">
          <h1 className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
            LingoDiary
          </h1>
        </div>
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-medium" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 w-full max-w-4xl mx-auto pb-20 md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center h-14 px-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-lg font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
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
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  <div className={cn(
                    "p-1 rounded-full transition-all duration-200",
                    isActive && "bg-primary/10"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
