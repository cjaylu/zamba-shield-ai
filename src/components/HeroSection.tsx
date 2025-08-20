import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDashboardClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    toast({
      title: "Dashboard Access",
      description: "Redirecting to your secure dashboard...",
    });
    // Add dashboard navigation logic here
  };

  const handleLearnMore = () => {
    toast({
      title: "Documentation",
      description: "Opening ZambaShield documentation...",
    });
    // Add documentation link logic here
  };

  return (
    <section className="relative py-16 px-6 bg-gradient-hero text-primary-foreground overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-accent/80" />
      
      <div className="relative container mx-auto text-center">
        <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
          <Shield className="mr-1 h-3 w-3" />
          Cybersecurity for Zambia
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Intelligent Threat
          <br />
          <span className="text-secondary">Detection</span> & Response
        </h1>
        
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
          ZambaShield uses advanced ML algorithms to detect phishing emails, scam SMS, 
          and brute-force attacks while promoting cybersecurity awareness across Zambia.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button variant="hero" size="lg" className="shadow-glow" onClick={handleDashboardClick}>
            <Shield className="mr-2 h-5 w-5" />
            {user ? "View Dashboard" : "Sign In to Dashboard"}
          </Button>
          <Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20" onClick={handleLearnMore}>
            Learn More
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div className="text-2xl font-bold mb-1">90%+</div>
            <div className="text-sm text-primary-foreground/80">Detection Accuracy</div>
          </div>
          
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
            <div className="text-2xl font-bold mb-1">&lt;10%</div>
            <div className="text-sm text-primary-foreground/80">False Positives</div>
          </div>
          
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <div className="text-2xl font-bold mb-1">3</div>
            <div className="text-sm text-primary-foreground/80">Pilot Institutions</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;