import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play } from 'lucide-react';
import { useTraining } from '@/hooks/useTraining';

interface TrainingModuleProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  points: number;
}

export const TrainingModule = ({ 
  id, 
  title, 
  description, 
  duration, 
  difficulty, 
  points 
}: TrainingModuleProps) => {
  const { getModuleProgress, startModule, continueModule } = useTraining();
  
  const moduleProgress = getModuleProgress(id);
  const progress = moduleProgress?.progress || 0;
  const status = moduleProgress?.status || 'not-started';

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
      default: return <Play className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDifficultyVariant = () => {
    switch (difficulty) {
      case 'Beginner': return 'outline';
      case 'Intermediate': return 'secondary';
      case 'Advanced': return 'destructive';
      default: return 'outline';
    }
  };

  const handleButtonClick = () => {
    if (status === 'not-started') {
      startModule(id);
    } else {
      continueModule(id);
    }
  };

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon()}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <CardDescription className="mb-3">{description}</CardDescription>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{duration}</span>
              <Badge variant={getDifficultyVariant()} className="text-xs">
                {difficulty}
              </Badge>
              <span>{points} points</span>
            </div>
          </div>
          <Button 
            variant={status === 'completed' ? 'outline' : 'default'} 
            size="sm"
            onClick={handleButtonClick}
          >
            {status === 'completed' 
              ? 'Review' 
              : status === 'in-progress' 
                ? 'Continue' 
                : 'Start'
            }
          </Button>
        </div>
      </CardHeader>
      {progress > 0 && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      )}
    </Card>
  );
};