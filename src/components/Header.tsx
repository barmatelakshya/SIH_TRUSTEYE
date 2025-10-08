import { Eye, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface HeaderProps {
  onNavigate: (section: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const navItems = [
    { label: "Scanner", value: "scanner" },
    { label: "Dashboard", value: "dashboard" },
    { label: "Education", value: "education" },
    { label: "About", value: "about" }
  ];

  return (
    <div className="gradient-bg text-white sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur group-hover:bg-white/20 transition-colors">
              <Eye className="h-6 w-6" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white tracking-tight">TRUST EYE</div>
              <div className="text-white/60 text-xs">Threat Detection</div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => onNavigate(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.value}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => onNavigate(item.value)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
