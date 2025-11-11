import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getTest } from "@/api";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  correct_answer: number;
}

interface QuizProps {
  day: number;
  onComplete: (score: number) => void;
  onBack: () => void;
  reviewMode?: boolean;
}

export const Quiz = ({ day, onComplete, onBack, reviewMode = false }: QuizProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(reviewMode);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const data = await getTest(day);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (error) {
        toast.error("Failed to load test questions. Please try again.");
        onBack();
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [day, onBack]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading test questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

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
        // Calculate score (correct_answer is 1-indexed, selectedAnswer is 0-indexed)
        const correct = newAnswers.filter(
          (answer, idx) => answer !== null && answer === questions[idx].correct_answer - 1
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
  const isCorrect = reviewMode && selectedAnswer === question.correct_answer - 1;

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
                const isCorrectOption = index === question.correct_answer - 1;
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
