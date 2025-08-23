import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ThreatCard from "@/components/ThreatCard";
import ThreatActivityFeed from "@/components/ThreatActivityFeed";
import SecurityStatusIndicator from "@/components/SecurityStatusIndicator";
import ThreatAnalyticsDashboard from "@/components/ThreatAnalyticsDashboard";
import LiveThreatDetection from "@/components/LiveThreatDetection";
import { useRealTimeThreats } from "@/hooks/useRealTimeThreats";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, Activity, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { threats, stats, isLoading, refetch } = useRealTimeThreats();
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Determine threat level based on recent threats
  const getThreatLevel = () => {
    const recentThreats = threats.filter(threat => {
      const threatTime = new Date(threat.timestamp);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return threatTime > oneDayAgo;
    });

    const criticalThreats = recentThreats.filter(t => t.severity === 'critical').length;
    const highThreats = recentThreats.filter(t => t.severity === 'high').length;

    if (criticalThreats > 0) return 'critical';
    if (highThreats > 2) return 'high';
    if (recentThreats.length > 5) return 'medium';
    return 'low';
  };

  const handleRefresh = async () => {
    await refetch();
    setLastRefresh(new Date());
    toast({
      title: "Dashboard Updated",
      description: "Latest threat data has been loaded",
    });
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">Please sign in to access your security dashboard</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Security Command Center
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Real-time cybersecurity monitoring and threat analysis
              <Badge variant="outline" className="ml-2">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Last updated</p>
              <p className="text-sm font-medium">{lastRefresh.toLocaleTimeString()}</p>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Security Status Indicators */}
        <SecurityStatusIndicator
          isMonitoring={isMonitoring}
          threatLevel={getThreatLevel()}
          threatsBlocked={stats.threats_blocked}
          systemsProtected={12}
        />

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ThreatCard
            title="Threats Detected"
            count={stats.total_threats}
            type={stats.total_threats > 10 ? "critical" : stats.total_threats > 5 ? "warning" : "safe"}
            icon="brute-force"
            description="Real-time monitoring"
          />
          <ThreatCard
            title="Emails Scanned"
            count={stats.emails_scanned}
            type="safe"
            icon="email"
            description="Automated protection"
          />
          <ThreatCard
            title="SMS Filtered"
            count={stats.sms_filtered}
            type={stats.sms_filtered > 5 ? "warning" : "safe"}
            icon="sms"
            description="Mobile security"
          />
          <ThreatCard
            title="Threats Blocked"
            count={stats.threats_blocked}
            type="safe"
            icon="general"
            description="Active defense"
          />
        </div>

        {/* Analytics Dashboard */}
        <ThreatAnalyticsDashboard threats={threats} stats={stats} />

        {/* Real-time Activity Feed and Live Detection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatActivityFeed threats={threats} isLoading={isLoading} />
          <LiveThreatDetection />
        </div>

        {/* System Performance */}
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader className="bg-gradient-primary rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-primary-foreground">
              <Zap className="h-5 w-5" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">&lt;100ms</div>
                <p className="text-sm text-muted-foreground">Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;