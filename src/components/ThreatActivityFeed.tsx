import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Mail, MessageSquare, AlertTriangle, Clock, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Threat {
  id: string;
  type: 'email' | 'sms' | 'brute_force';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  status: 'detected' | 'blocked' | 'quarantined';
  timestamp: string;
  description: string;
}

interface ThreatActivityFeedProps {
  threats: Threat[];
  isLoading: boolean;
}

const ThreatActivityFeed = ({ threats, isLoading }: ThreatActivityFeedProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'brute_force':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'blocked':
        return 'destructive';
      case 'quarantined':
        return 'secondary';
      case 'detected':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5 text-primary" />
            Real-time Threat Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader className="bg-gradient-primary rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-primary-foreground">
          <Shield className="h-5 w-5" />
          Real-time Threat Activity
          <Badge variant="secondary" className="ml-auto">
            {threats.length} Events
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {threats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="h-12 w-12 text-success mb-4" />
              <p className="text-foreground font-medium">All Clear!</p>
              <p className="text-muted-foreground text-sm">No recent threats detected</p>
            </div>
          ) : (
            <div className="space-y-1">
              {threats.map((threat, index) => (
                <div
                  key={threat.id}
                  className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/50 ${
                    index !== threats.length - 1 ? 'border-b border-border/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-full ${
                      threat.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                      threat.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                      threat.severity === 'medium' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {getTypeIcon(threat.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant={getSeverityVariant(threat.severity)}
                          className="text-xs"
                        >
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <Badge 
                          variant={getStatusVariant(threat.status)}
                          className="text-xs"
                        >
                          {threat.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {threat.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Source: {threat.source}</span>
                        <span>Target: {threat.target}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(threat.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="ml-2">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ThreatActivityFeed;