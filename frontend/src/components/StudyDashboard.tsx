import { useState } from "react";
import { TestCard, TestStatus } from "./TestCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface StudyDashboardProps {
  onStartTest: (day: number) => void;
  onOpenFlashcards: () => void;
  studyTitle?: string;
}

export const StudyDashboard = ({
  onStartTest,
  onOpenFlashcards,
  studyTitle = "Introduction to Computer Science",
}: StudyDashboardProps) => {
  // Mock data - in real app, this would come from backend
  const [tests] = useState([
    { day: 1, date: "Oct 30, 2025", status: "completed" as TestStatus, score: 85 },
    { day: 2, date: "Oct 31, 2025", status: "completed" as TestStatus, score: 92 },
    { day: 3, date: "Nov 1, 2025", status: "upcoming" as TestStatus },
    { day: 4, date: "Nov 2, 2025", status: "locked" as TestStatus },
    { day: 5, date: "Nov 3, 2025", status: "locked" as TestStatus },
    { day: 6, date: "Nov 4, 2025", status: "locked" as TestStatus },
    { day: 7, date: "Nov 5, 2025", status: "locked" as TestStatus },
  ]);

  const completedTests = tests.filter((t) => t.status === "completed").length;
  const progress = (completedTests / tests.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      <div className="mb-8">
        <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">{studyTitle}</h2>
              <p className="text-muted-foreground">
                Your personalized 7-day adaptive learning journey
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="text-sm">
                  <span className="font-semibold text-primary">{completedTests}</span>
                  <span className="text-muted-foreground"> of 7 tests completed</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{progress.toFixed(0)}%</div>
              <p className="text-sm text-muted-foreground mt-1">Progress</p>
            </div>
          </div>
          <div className="mt-4 w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Your Study Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <TestCard
              key={test.day}
              day={test.day}
              date={test.date}
              status={test.status}
              score={test.score}
              onStart={() => onStartTest(test.day)}
            />
          ))}
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Practice with Flashcards</h3>
            <p className="text-muted-foreground">
              Reinforce your learning with adaptive flashcards based on your performance
            </p>
          </div>
          <Button
            onClick={onOpenFlashcards}
            variant="success"
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="h-5 w-5" />
            Open Flashcards
          </Button>
        </div>
      </Card>
    </div>
  );
};
