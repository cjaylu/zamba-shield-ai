import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ThreatCard from "@/components/ThreatCard";
import ThreatChart from "@/components/ThreatChart";
import { Shield, AlertTriangle, Mail, MessageSquare, Server, Users } from "lucide-react";

const Dashboard = () => {
  const threatData = [
    { name: "Jan", threats: 45 },
    { name: "Feb", threats: 52 },
    { name: "Mar", threats: 48 },
    { name: "Apr", threats: 61 },
    { name: "May", threats: 55 },
    { name: "Jun", threats: 67 },
  ];

  const emailData = [
    { name: "Jan", emails: 1200 },
    { name: "Feb", emails: 1100 },
    { name: "Mar", emails: 1300 },
    { name: "Apr", emails: 1450 },
    { name: "May", emails: 1350 },
    { name: "Jun", emails: 1500 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Security Dashboard</h1>
          <p className="text-muted-foreground">Real-time cybersecurity monitoring and threat analysis</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ThreatCard
            title="Threats Blocked"
            count={1247}
            type="critical"
            icon="brute-force"
            description="This month"
          />
          <ThreatCard
            title="Emails Scanned"
            count={15642}
            type="safe"
            icon="email"
            description="Last 24 hours"
          />
          <ThreatCard
            title="SMS Filtered"
            count={892}
            type="warning"
            icon="sms"
            description="This week"
          />
          <ThreatCard
            title="Systems Protected"
            count={12}
            type="safe"
            icon="general"
            description="Active monitoring"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ThreatChart
            title="Threat Detection Trends"
            data={threatData}
            type="line"
            dataKey="threats"
            color="hsl(var(--chart-1))"
          />
          <ThreatChart
            title="Email Processing Volume"
            data={emailData}
            type="bar"
            dataKey="emails"
            color="hsl(var(--chart-2))"
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Recent Security Events
            </CardTitle>
            <CardDescription>Latest detected threats and system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2 minutes ago", event: "Phishing email blocked", severity: "high" },
                { time: "15 minutes ago", event: "Brute force attempt detected", severity: "critical" },
                { time: "1 hour ago", event: "Suspicious SMS filtered", severity: "medium" },
                { time: "3 hours ago", event: "System scan completed", severity: "low" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <Badge variant={item.severity === "critical" ? "destructive" : item.severity === "high" ? "destructive" : item.severity === "medium" ? "secondary" : "outline"}>
                      {item.severity}
                    </Badge>
                    <span className="text-sm">{item.event}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;