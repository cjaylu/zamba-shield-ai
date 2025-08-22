import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { TrainingModule } from "@/components/TrainingModule";
import { BookOpen, Trophy, Target, CheckCircle } from "lucide-react";
import { useTraining } from "@/hooks/useTraining";

const Training = () => {
  const { progress, loading } = useTraining();
  
  const modules = [
    {
      id: "phishing-email-recognition",
      title: "Phishing Email Recognition",
      description: "Learn to identify and avoid phishing emails",
      duration: "15 min",
      difficulty: "Beginner",
      points: 50
    },
    {
      id: "sms-scam-awareness",
      title: "SMS Scam Awareness",
      description: "Recognize common SMS scams in Zambia",
      duration: "20 min",
      difficulty: "Beginner",
      points: 75
    },
    {
      id: "password-security-best-practices",
      title: "Password Security Best Practices",
      description: "Create and manage strong passwords",
      duration: "25 min",
      difficulty: "Intermediate",
      points: 100
    },
    {
      id: "social-engineering-defense",
      title: "Social Engineering Defense",
      description: "Protect against social engineering attacks",
      duration: "30 min",
      difficulty: "Advanced",
      points: 125
    },
    {
      id: "mobile-money-security",
      title: "Mobile Money Security",
      description: "Secure your mobile money transactions",
      duration: "18 min",
      difficulty: "Beginner",
      points: 60
    }
  ];

  const achievements = [
    { name: "First Steps", description: "Complete your first training module", unlocked: true },
    { name: "Email Expert", description: "Master phishing email recognition", unlocked: true },
    { name: "SMS Guardian", description: "Complete SMS scam awareness training", unlocked: false },
    { name: "Security Champion", description: "Complete all training modules", unlocked: false }
  ];

  // Calculate dynamic stats from actual progress
  const completedModules = progress.filter(p => p.status === 'completed').length;
  const totalPoints = progress.reduce((sum, p) => {
    if (p.status === 'completed') {
      const module = modules.find(m => m.id === p.module_id);
      return sum + (module?.points || 0);
    }
    return sum;
  }, 0);
  const overallProgress = Math.round((completedModules / modules.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="text-center">Loading training data...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Cybersecurity Training</h1>
          <p className="text-muted-foreground">Build your cybersecurity knowledge and skills</p>
        </div>

        {/* User Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{totalPoints}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Total Points
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{completedModules}/{modules.length}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Modules Completed
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{overallProgress}%</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Overall Progress
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Training Modules */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Training Modules
                </CardTitle>
                <CardDescription>Interactive cybersecurity training courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.map((module) => (
                    <TrainingModule
                      key={module.id}
                      id={module.id}
                      title={module.title}
                      description={module.description}
                      duration={module.duration}
                      difficulty={module.difficulty}
                      points={module.points}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription>Track your learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${achievement.unlocked ? 'border-success bg-success/10' : 'border-border bg-muted/50'}`}>
                      <Trophy className={`h-5 w-5 ${achievement.unlocked ? 'text-success' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.name}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Security Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Always verify the sender's identity before clicking links in emails or SMS messages. When in doubt, contact the organization directly using official contact information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Training;