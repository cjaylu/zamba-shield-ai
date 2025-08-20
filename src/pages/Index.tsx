import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ThreatCard from "@/components/ThreatCard";
import ThreatChart from "@/components/ThreatChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Mail, 
  MessageSquare, 
  Laptop, 
  Users,
  BookOpen,
  Target
} from "lucide-react";

const Index = () => {
  // Sample data for charts
  const threatTrendData = [
    { time: "00:00", threats: 12 },
    { time: "04:00", threats: 8 },
    { time: "08:00", threats: 25 },
    { time: "12:00", threats: 18 },
    { time: "16:00", threats: 32 },
    { time: "20:00", threats: 15 },
  ];

  const detectionData = [
    { time: "Mon", blocked: 45, allowed: 523 },
    { time: "Tue", blocked: 38, allowed: 487 },
    { time: "Wed", blocked: 52, allowed: 445 },
    { time: "Thu", blocked: 41, allowed: 501 },
    { time: "Fri", blocked: 67, allowed: 398 },
    { time: "Sat", blocked: 29, allowed: 234 },
    { time: "Sun", blocked: 23, allowed: 198 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-12">
        {/* Threat Overview Cards */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Threat Overview</h2>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <Activity className="mr-1 h-3 w-3" />
              System Active
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ThreatCard
              title="Email Threats"
              count={23}
              type="warning"
              icon="email"
              description="Phishing attempts detected today"
            />
            <ThreatCard
              title="SMS Scams"
              count={8}
              type="critical"
              icon="sms"
              description="Fraudulent messages blocked"
            />
            <ThreatCard
              title="Brute Force"
              count={2}
              type="critical"
              icon="brute-force"
              description="Login attempts blocked"
            />
            <ThreatCard
              title="Safe Messages"
              count={1247}
              type="safe"
              icon="general"
              description="Messages processed safely"
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Threat Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ThreatChart
              title="Threat Activity (24h)"
              data={threatTrendData}
              type="line"
              dataKey="threats"
              color="hsl(var(--destructive))"
            />
            <ThreatChart
              title="Weekly Detection Summary"
              data={detectionData}
              type="bar"
              dataKey="blocked"
              color="hsl(var(--warning))"
            />
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Core Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Email Protection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced NLP and ML algorithms detect phishing emails with 90%+ accuracy, 
                  automatically quarantining malicious messages.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  View Email Logs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">SMS Filtering</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Multi-language support for English, Bemba, Nyanja, and Tonga. 
                  Detects mobile money scams and lottery frauds.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  SMS Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Laptop className="h-5 w-5 text-warning" />
                  <CardTitle className="text-lg">Brute Force Detection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Real-time monitoring of login attempts with automatic IP blocking 
                  and administrator alerts for suspicious activity.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  Security Logs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-success" />
                  <CardTitle className="text-lg">User Training</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interactive cybersecurity training with phishing simulations, 
                  quizzes, and gamified challenges to boost awareness.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  Start Training
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-lg">Local Deployment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Optimized for low-spec servers with offline-first capabilities. 
                  Designed specifically for Zambian cybersecurity challenges.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  Deployment Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Multi-Role Access</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Role-based access control for administrators, security officers, 
                  and end users with appropriate permission levels.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 px-6 bg-gradient-hero rounded-2xl text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Zambia?</h2>
          <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Join the pilot program and help us build a safer digital future for Zambian institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              <Shield className="mr-2 h-5 w-5" />
              Request Demo
            </Button>
            <Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
              View Documentation
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;