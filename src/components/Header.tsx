import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Bell, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import zambaShieldLogo from "@/assets/zamba-shield-logo.png";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
  };

  const handleNavigation = (path: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    // Add navigation logic here when routes are implemented
    toast({
      title: "Feature Coming Soon",
      description: "This feature will be available in the next update.",
    });
  };

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
          <Button variant="ghost" className="text-sm" onClick={() => handleNavigation("/dashboard")}>
            <Shield className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="text-sm" onClick={() => handleNavigation("/threats")}>
            Threats
          </Button>
          <Button variant="ghost" className="text-sm" onClick={() => handleNavigation("/training")}>
            Training
          </Button>
          <Button variant="ghost" className="text-sm" onClick={() => handleNavigation("/reports")}>
            Reports
          </Button>
        </nav>

        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative" onClick={() => handleNavigation("/notifications")}>
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive text-destructive-foreground">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleNavigation("/settings")}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleNavigation("/profile")}>
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;