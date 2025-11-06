import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  day: number;
  onComplete: (score: number) => void;
  onBack: () => void;
  reviewMode?: boolean;
}

export const Quiz = ({ day, onComplete, onBack, reviewMode = false }: QuizProps) => {
  // Mock questions - in real app, these come from backend
  const questions: Question[] = [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Tree"],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlinks and Text Markup Language",
      ],
      correctAnswer: 0,
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(reviewMode);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(answers[currentQuestion + 1]);
      } else {
        // Calculate score
        const correct = newAnswers.filter(
          (answer, idx) => answer === questions[idx].correctAnswer
        ).length;
        const score = Math.round((correct / questions.length) * 100);
        onComplete(score);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const question = questions[currentQuestion];
  const isCorrect = reviewMode && selectedAnswer === question.correctAnswer;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                Day {day} Test
              </div>
              {reviewMode && (
                <div
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    isCorrect
                      ? "bg-success-light text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {isCorrect ? "Correct" : "Incorrect"}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
          </div>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            disabled={reviewMode}
          >
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = index === question.correctAnswer;
                const showCorrect = reviewMode && isCorrectOption;
                const showIncorrect = reviewMode && isSelected && !isCorrectOption;

                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      showCorrect
                        ? "border-success bg-success-light"
                        : showIncorrect
                        ? "border-destructive bg-destructive/10"
                        : isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer flex items-center justify-between"
                    >
                      <span>{option}</span>
                      {showCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                      {showIncorrect && <XCircle className="h-5 w-5 text-destructive" />}
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="gap-2"
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
