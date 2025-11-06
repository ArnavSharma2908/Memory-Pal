import { Calendar, CheckCircle2, Lock, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type TestStatus = "upcoming" | "completed" | "locked";

interface TestCardProps {
  day: number;
  date: string;
  status: TestStatus;
  score?: number;
  onStart?: () => void;
}

export const TestCard = ({ day, date, status, score, onStart }: TestCardProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "upcoming":
        return {
          bgClass: "bg-card hover:shadow-lg hover:scale-105 cursor-pointer border-primary/50",
          badge: <Badge className="bg-primary">Ready</Badge>,
          icon: <Play className="h-5 w-5 text-primary" />,
          actionButton: (
            <Button onClick={onStart} className="w-full mt-4">
              Start Test
            </Button>
          ),
        };
      case "completed":
        return {
          bgClass: "bg-success-light border-success/50",
          badge: (
            <Badge className="bg-success">
              Completed {score ? `- ${score}%` : ""}
            </Badge>
          ),
          icon: <CheckCircle2 className="h-5 w-5 text-success" />,
          actionButton: (
            <Button onClick={onStart} variant="outline" className="w-full mt-4">
              Review Answers
            </Button>
          ),
        };
      case "locked":
        return {
          bgClass: "bg-muted/50 opacity-70 cursor-not-allowed border-muted",
          badge: <Badge variant="outline">Locked</Badge>,
          icon: <Lock className="h-5 w-5 text-muted-foreground" />,
          actionButton: null,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card
      className={`p-6 transition-all duration-300 ${config.bgClass}`}
      onClick={status === "upcoming" ? onStart : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold mb-1">Day {day}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {config.icon}
          {config.badge}
        </div>
      </div>
      {config.actionButton}
    </Card>
  );
};
