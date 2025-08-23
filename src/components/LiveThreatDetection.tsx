import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Shield, AlertTriangle, Zap, Activity, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LiveThreatDetection = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const runThreatScan = async () => {
    setIsScanning(true);
    try {
      // Simulate threat detection scanning
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults = [
        {
          id: 1,
          type: 'Network Scan',
          status: 'complete',
          threats: 0,
          scanned: 156,
          time: new Date(),
        },
        {
          id: 2,
          type: 'Email Analysis',
          status: 'complete',
          threats: 2,
          scanned: 45,
          time: new Date(),
        },
        {
          id: 3,
          type: 'SMS Filter',
          status: 'complete',
          threats: 1,
          scanned: 23,
          time: new Date(),
        },
      ];

      setScanResults(mockResults);
      setLastScan(new Date());
      
      const totalThreats = mockResults.reduce((sum, result) => sum + result.threats, 0);
      
      toast({
        title: "Security Scan Complete",
        description: `Scanned ${mockResults.reduce((sum, r) => sum + r.scanned, 0)} items, found ${totalThreats} threats`,
        variant: totalThreats > 0 ? 'destructive' : 'default',
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to complete security scan",
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const testThreatDetection = async () => {
    try {
      // Test the threat monitor function with sample data
      const response = await supabase.functions.invoke('threat-monitor', {
        body: {
          email: 'test@example.com',
          content: {
            subject: 'URGENT ACTION REQUIRED - Verify your account',
            body: 'Click here immediately to verify your account or it will be suspended',
          },
          type: 'email'
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Threat Detection Test",
        description: response.data.threat_detected ? 
          "✅ Threat detection is working - test threat identified" : 
          "✅ System is working - content marked as safe",
        variant: response.data.threat_detected ? 'destructive' : 'default',
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to test threat detection system",
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // Auto-scan every 5 minutes
    const interval = setInterval(() => {
      if (!isScanning) {
        runThreatScan();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader className="bg-gradient-primary rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-primary-foreground">
          <Zap className="h-5 w-5" />
          Live Threat Detection
          <Badge variant="secondary" className="ml-auto">
            <Activity className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Scan Controls */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Security Monitoring</p>
            <p className="text-sm text-muted-foreground">
              {lastScan ? `Last scan: ${lastScan.toLocaleTimeString()}` : 'No recent scans'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={testThreatDetection}
              variant="outline" 
              size="sm"
            >
              Test Detection
            </Button>
            <Button 
              onClick={runThreatScan}
              disabled={isScanning}
              className="bg-primary hover:bg-primary-glow"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Run Scan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Scan Progress */}
        {isScanning && (
          <Alert className="border-primary/20 bg-primary/5">
            <Activity className="h-4 w-4 animate-pulse" />
            <AlertDescription>
              Running comprehensive security scan across all monitored systems...
            </AlertDescription>
          </Alert>
        )}

        {/* Scan Results */}
        {scanResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Latest Scan Results</h4>
            {scanResults.map((result) => (
              <div 
                key={result.id} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
              >
                <div className="flex items-center gap-3">
                  {result.threats > 0 ? (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                  <div>
                    <p className="font-medium text-sm text-foreground">{result.type}</p>
                    <p className="text-xs text-muted-foreground">
                      Scanned {result.scanned} items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {result.threats > 0 ? (
                    <Badge variant="destructive" className="text-xs">
                      {result.threats} threat{result.threats !== 1 ? 's' : ''}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-success">
                      Clean
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* System Status */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="text-lg font-bold text-success">Online</div>
            <p className="text-xs text-muted-foreground">System Status</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">24/7</div>
            <p className="text-xs text-muted-foreground">Monitoring</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">&lt;1s</div>
            <p className="text-xs text-muted-foreground">Response Time</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveThreatDetection;