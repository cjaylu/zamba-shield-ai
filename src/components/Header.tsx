import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Bell, User, Settings } from "lucide-react";
import zambaShieldLogo from "@/assets/zamba-shield-logo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src={zambaShieldLogo} alt="ZambaShield" className="h-8 w-8" />
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-foreground">ZambaShield</h1>
              <Badge variant="outline" className="text-xs">v1.0</Badge>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className="text-sm">
            <Shield className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="text-sm">
            Threats
          </Button>
          <Button variant="ghost" className="text-sm">
            Training
          </Button>
          <Button variant="ghost" className="text-sm">
            Reports
          </Button>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive text-destructive-foreground">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;