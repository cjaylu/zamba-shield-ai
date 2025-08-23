import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ThreatChart from "./ThreatChart";
import { BarChart3, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface ThreatAnalyticsDashboardProps {
  threats: any[];
  stats: {
    total_threats: number;
    emails_scanned: number;
    sms_filtered: number;
    brute_force_attempts: number;
    threats_blocked: number;
  };
}

const ThreatAnalyticsDashboard = ({ threats, stats }: ThreatAnalyticsDashboardProps) => {
  const [threatTrends, setThreatTrends] = useState<any[]>([]);
  const [emailAnalytics, setEmailAnalytics] = useState<any[]>([]);

  useEffect(() => {
    // Process threat data for charts
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const threatData = last7Days.map(date => {
      const dayThreats = threats.filter(threat => {
        const threatDate = new Date(threat.timestamp);
        return threatDate.toDateString() === date.toDateString();
      });

      return {
        time: date.toLocaleDateString('en-US', { weekday: 'short' }),
        threats: dayThreats.length,
        critical: dayThreats.filter(t => t.severity === 'critical').length,
        high: dayThreats.filter(t => t.severity === 'high').length,
        blocked: dayThreats.filter(t => t.status === 'blocked' || t.status === 'quarantined').length,
      };
    });

    const emailData = last7Days.map(date => {
      const dayEmails = threats.filter(threat => {
        const threatDate = new Date(threat.timestamp);
        return threatDate.toDateString() === date.toDateString() && threat.type === 'email';
      });

      return {
        time: date.toLocaleDateString('en-US', { weekday: 'short' }),
        emails: dayEmails.length,
        safe: dayEmails.filter(e => e.classification === 'safe').length,
        threats: dayEmails.filter(e => e.classification === 'threat').length,
      };
    });

    setThreatTrends(threatData);
    setEmailAnalytics(emailData);
  }, [threats]);

  const threatGrowth = threatTrends.length >= 2 ? 
    ((threatTrends[threatTrends.length - 1]?.threats || 0) - (threatTrends[threatTrends.length - 2]?.threats || 0)) : 0;

  const detectionRate = stats.total_threats > 0 ? 
    ((stats.threats_blocked / stats.total_threats) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Detection Rate</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-foreground">{detectionRate}%</span>
                  <Badge variant="secondary" className="text-xs">
                    {stats.threats_blocked}/{stats.total_threats}
                  </Badge>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Threat Growth</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-2xl font-bold ${threatGrowth > 0 ? 'text-destructive' : 'text-success'}`}>
                    {threatGrowth > 0 ? '+' : ''}{threatGrowth}
                  </span>
                  <span className="text-sm text-muted-foreground">vs yesterday</span>
                </div>
              </div>
              <AlertTriangle className={`h-8 w-8 ${threatGrowth > 0 ? 'text-destructive' : 'text-success'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email Protection</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-foreground">{stats.emails_scanned}</span>
                  <span className="text-sm text-muted-foreground">scanned</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SMS Protection</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-foreground">{stats.sms_filtered}</span>
                  <span className="text-sm text-muted-foreground">filtered</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatChart
          title="Threat Detection Trends"
          data={threatTrends}
          type="line"
          dataKey="threats"
          color="hsl(var(--destructive))"
        />
        <ThreatChart
          title="Email Security Analysis"
          data={emailAnalytics}
          type="bar"
          dataKey="emails"
          color="hsl(var(--primary))"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Threat Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Email Threats', count: threats.filter(t => t.type === 'email').length, color: 'bg-primary' },
                { type: 'SMS Threats', count: threats.filter(t => t.type === 'sms').length, color: 'bg-accent' },
                { type: 'Brute Force', count: threats.filter(t => t.type === 'brute_force').length, color: 'bg-destructive' },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium text-foreground">{item.type}</span>
                  </div>
                  <Badge variant="outline">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Security Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Threats Detected</span>
                <span className="font-medium text-foreground">{stats.total_threats}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Threats Blocked</span>
                <span className="font-medium text-success">{stats.threats_blocked}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-medium text-success">{detectionRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${detectionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreatAnalyticsDashboard;