import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { BookOpen, Trophy, Target, Play, CheckCircle, Clock } from "lucide-react";

const Training = () => {
  const modules = [
    {
      id: 1,
      title: "Phishing Email Recognition",
      description: "Learn to identify and avoid phishing emails",
      progress: 100,
      status: "completed",
      duration: "15 min",
      difficulty: "Beginner",
      points: 50
    },
    {
      id: 2,
      title: "SMS Scam Awareness",
      description: "Recognize common SMS scams in Zambia",
      progress: 60,
      status: "in-progress",
      duration: "20 min",
      difficulty: "Beginner",
      points: 75
    },
    {
      id: 3,
      title: "Password Security Best Practices",
      description: "Create and manage strong passwords",
      progress: 0,
      status: "not-started",
      duration: "25 min",
      difficulty: "Intermediate",
      points: 100
    },
    {
      id: 4,
      title: "Social Engineering Defense",
      description: "Protect against social engineering attacks",
      progress: 0,
      status: "not-started",
      duration: "30 min",
      difficulty: "Advanced",
      points: 125
    },
    {
      id: 5,
      title: "Mobile Money Security",
      description: "Secure your mobile money transactions",
      progress: 0,
      status: "not-started",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-success" />;
      case "in-progress": return <Clock className="h-4 w-4 text-warning" />;
      default: return <Play className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "outline";
      case "Intermediate": return "secondary";
      case "Advanced": return "destructive";
      default: return "outline";
    }
  };

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
              <CardTitle className="text-2xl">310</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Total Points
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">2/5</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Modules Completed
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">32%</CardTitle>
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
                    <div key={module.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(module.status)}
                            <h3 className="font-semibold">{module.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{module.duration}</span>
                            <Badge variant={getDifficultyVariant(module.difficulty)} className="text-xs">
                              {module.difficulty}
                            </Badge>
                            <span>{module.points} points</span>
                          </div>
                        </div>
                        <Button variant={module.status === "completed" ? "outline" : "default"} size="sm">
                          {module.status === "completed" ? "Review" : module.status === "in-progress" ? "Continue" : "Start"}
                        </Button>
                      </div>
                      {module.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                      )}
                    </div>
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