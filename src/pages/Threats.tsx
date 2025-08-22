import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { AlertTriangle, Mail, MessageSquare, Filter, Search, Eye } from "lucide-react";

const Threats = () => {
  const threats = [
    {
      id: 1,
      type: "Phishing Email",
      severity: "high",
      source: "suspicious@fake-bank.com",
      target: "user@company.zm",
      timestamp: "2024-01-20 14:30:25",
      status: "blocked",
      description: "Fake banking credential request"
    },
    {
      id: 2,
      type: "Scam SMS",
      severity: "critical",
      source: "+260971234567",
      target: "+260977654321",
      timestamp: "2024-01-20 13:45:12",
      status: "quarantined",
      description: "Fake mobile money lottery scam"
    },
    {
      id: 3,
      type: "Brute Force",
      severity: "critical",
      source: "192.168.1.100",
      target: "server.company.zm",
      timestamp: "2024-01-20 12:15:08",
      status: "blocked",
      description: "Multiple failed login attempts"
    },
    {
      id: 4,
      type: "Phishing Email",
      severity: "medium",
      source: "noreply@suspicious-site.com",
      target: "admin@company.zm",
      timestamp: "2024-01-20 11:20:45",
      status: "reviewed",
      description: "Suspicious software download link"
    },
    {
      id: 5,
      type: "Scam SMS",
      severity: "high",
      source: "+260966987654",
      target: "+260971111111",
      timestamp: "2024-01-20 10:30:15",
      status: "blocked",
      description: "Fake government tax refund scam"
    }
  ];

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "blocked": return "destructive";
      case "quarantined": return "secondary";
      case "reviewed": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Threat Management</h1>
          <p className="text-muted-foreground">Monitor and manage detected security threats</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input placeholder="Search threats..." className="w-full" />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button variant="outline">All Types</Button>
              <Button variant="outline">All Severities</Button>
            </div>
          </CardContent>
        </Card>

        {/* Threats Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Detected Threats
            </CardTitle>
            <CardDescription>Recent security threats and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium">Type</th>
                    <th className="text-left py-3 px-2 font-medium">Severity</th>
                    <th className="text-left py-3 px-2 font-medium">Source</th>
                    <th className="text-left py-3 px-2 font-medium">Target</th>
                    <th className="text-left py-3 px-2 font-medium">Time</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                    <th className="text-left py-3 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {threats.map((threat) => (
                    <tr key={threat.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {threat.type.includes("Email") ? (
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          ) : threat.type.includes("SMS") ? (
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">{threat.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={getSeverityVariant(threat.severity)}>
                          {threat.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm font-mono">{threat.source}</td>
                      <td className="py-3 px-2 text-sm font-mono">{threat.target}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">{threat.timestamp}</td>
                      <td className="py-3 px-2">
                        <Badge variant={getStatusVariant(threat.status)}>
                          {threat.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Threats;