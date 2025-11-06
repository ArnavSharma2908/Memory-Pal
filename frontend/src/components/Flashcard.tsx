import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCw, X } from "lucide-react";

interface FlashcardData {
  id: number;
  question: string;
  answer: string;
  topic: string;
}

interface FlashcardProps {
  onClose: () => void;
  adaptiveMode?: boolean;
}

export const Flashcard = ({ onClose, adaptiveMode = true }: FlashcardProps) => {
  // Mock flashcards - in real app, these come from backend
  const flashcards: FlashcardData[] = [
    {
      id: 1,
      question: "What is a variable in programming?",
      answer:
        "A variable is a named storage location in memory that holds a value which can be changed during program execution.",
      topic: "Programming Basics",
    },
    {
      id: 2,
      question: "Define 'algorithm'",
      answer:
        "An algorithm is a step-by-step procedure or formula for solving a problem or completing a task.",
      topic: "Computer Science Fundamentals",
    },
    {
      id: 3,
      question: "What is the purpose of a loop?",
      answer:
        "A loop is used to repeatedly execute a block of code until a certain condition is met, reducing code repetition.",
      topic: "Control Structures",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-3xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Flashcards</h2>
            <p className="text-muted-foreground">
              {adaptiveMode
                ? "Adaptive mode - focusing on your weak areas"
                : "Practice mode - random distribution"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative">
          <div
            className="perspective-1000 cursor-pointer"
            onClick={handleFlip}
            style={{ perspective: "1000px" }}
          >
            <Card
              className={`relative h-96 transition-transform duration-500 preserve-3d ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                    {currentCard.topic}
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-6">{currentCard.question}</h3>
                <p className="text-muted-foreground text-sm">
                  Click to reveal answer
                </p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center bg-primary/5 [transform:rotateY(180deg)] backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-success/10 text-success rounded-lg text-sm font-semibold">
                    Answer
                  </span>
                </div>
                <p className="text-xl leading-relaxed">{currentCard.answer}</p>
              </div>
            </Card>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -left-16 hidden lg:block">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="rounded-full w-12 h-12"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-16 hidden lg:block">
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="rounded-full w-12 h-12"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {flashcards.length}
            </span>
            <Button variant="outline" size="sm" onClick={handleFlip}>
              <RotateCw className="h-4 w-4 mr-2" />
              Flip Card
            </Button>
          </div>
        </div>

        <div className="flex gap-1 justify-center">
          {flashcards.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
