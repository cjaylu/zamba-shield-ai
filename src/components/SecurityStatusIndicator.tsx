import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, AlertTriangle, Activity, Wifi } from "lucide-react";
import { useState, useEffect } from "react";

interface SecurityStatusIndicatorProps {
  isMonitoring: boolean;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  threatsBlocked: number;
  systemsProtected: number;
}

const SecurityStatusIndicator = ({ 
  isMonitoring, 
  threatLevel, 
  threatsBlocked, 
  systemsProtected 
}: SecurityStatusIndicatorProps) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setPulse(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getThreatLevelColor = () => {
    switch (threatLevel) {
      case 'critical':
        return 'text-destructive bg-destructive/10';
      case 'high':
        return 'text-destructive bg-destructive/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'low':
        return 'text-success bg-success/10';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  const getThreatLevelText = () => {
    switch (threatLevel) {
      case 'critical':
        return 'CRITICAL THREAT LEVEL';
      case 'high':
        return 'HIGH THREAT LEVEL';
      case 'medium':
        return 'MEDIUM THREAT LEVEL';
      case 'low':
        return 'LOW THREAT LEVEL';
      default:
        return 'UNKNOWN';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Monitoring Status */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">System Status</p>
            <div className="flex items-center gap-2 mt-2">
              <div className={`flex items-center gap-2 ${isMonitoring ? 'text-success' : 'text-destructive'}`}>
                {isMonitoring ? (
                  <div className="relative">
                    <Wifi className="h-5 w-5" />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      pulse ? 'bg-success' : 'bg-success/50'
                    } transition-all duration-500`} />
                  </div>
                ) : (
                  <Wifi className="h-5 w-5" />
                )}
                <span className="font-semibold">
                  {isMonitoring ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </div>
            </div>
          </div>
          <Activity className={`h-8 w-8 ${isMonitoring ? 'text-success' : 'text-muted-foreground'}`} />
        </CardContent>
      </Card>

      {/* Threat Level */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Threat Level</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`text-xs ${getThreatLevelColor()}`}>
                {getThreatLevelText()}
              </Badge>
            </div>
          </div>
          <AlertTriangle className={`h-8 w-8 ${getThreatLevelColor().split(' ')[0]}`} />
        </CardContent>
      </Card>

      {/* Threats Blocked */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Threats Blocked</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-bold text-destructive">{threatsBlocked}</span>
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
          </div>
          <Shield className="h-8 w-8 text-destructive" />
        </CardContent>
      </Card>

      {/* Systems Protected */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Systems Protected</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-bold text-success">{systemsProtected}</span>
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
          </div>
          <ShieldCheck className="h-8 w-8 text-success" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityStatusIndicator;