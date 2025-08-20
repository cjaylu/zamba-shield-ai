import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Mail, MessageSquare } from "lucide-react";

interface ThreatCardProps {
  title: string;
  count: number;
  type: "critical" | "warning" | "safe";
  icon: "email" | "sms" | "brute-force" | "general";
  description: string;
}

const ThreatCard = ({ title, count, type, icon, description }: ThreatCardProps) => {
  const iconMap = {
    email: Mail,
    sms: MessageSquare,
    "brute-force": AlertTriangle,
    general: Shield,
  };

  const IconComponent = iconMap[icon];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "critical":
        return "text-destructive border-destructive/20 bg-destructive/5";
      case "warning":
        return "text-warning border-warning/20 bg-warning/5";
      case "safe":
        return "text-success border-success/20 bg-success/5";
      default:
        return "text-muted-foreground border-border bg-muted/10";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      case "safe":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <IconComponent className={`h-4 w-4 ${getTypeStyles(type)}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">{count}</div>
          <Badge variant={getBadgeVariant(type)} className="capitalize">
            {type}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ThreatCard;