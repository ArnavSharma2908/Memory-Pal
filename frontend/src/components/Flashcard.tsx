import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCw, X, Loader2, AlertCircle } from "lucide-react";
import { getFlashcard } from "@/api";
import { toast } from "sonner";

const FLASHCARDS_STORAGE_KEYS = {
  DECK: "flashcardsDeck",
  INDEX: "flashcardsIndex",
  FLIPPED: "flashcardsFlipped",
} as const;

interface FlashcardData {
  question: string;
  answer: string;
}

interface FlashcardProps {
  onClose: () => void;
}

export const Flashcard = ({ onClose }: FlashcardProps) => {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from storage or fetch first card on mount
  useEffect(() => {
    try {
      const savedDeckRaw = localStorage.getItem(FLASHCARDS_STORAGE_KEYS.DECK);
      if (savedDeckRaw) {
        const parsed: unknown = JSON.parse(savedDeckRaw);
        if (Array.isArray(parsed)) {
          const deck = parsed.filter(
            (c): c is FlashcardData => typeof c === "object" && c !== null && "question" in c && "answer" in c
          );
          if (deck.length) {
            setFlashcards(deck);
            const savedIndex = localStorage.getItem(FLASHCARDS_STORAGE_KEYS.INDEX);
            const idx = savedIndex ? Math.min(Math.max(parseInt(savedIndex, 10), 0), deck.length - 1) : 0;
            setCurrentIndex(idx);
            const flippedRaw = localStorage.getItem(FLASHCARDS_STORAGE_KEYS.FLIPPED);
            setIsFlipped(flippedRaw ? flippedRaw === "true" : false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn("Flashcard restore failed", e);
    }
    void appendFlashcard();
  }, []);

  // Append a new flashcard and move index to the new card
  const appendFlashcard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFlashcard();
      if (data?.question && data?.answer) {
        setFlashcards((prev) => {
          const next = [...prev, { question: data.question, answer: data.answer }];
          setCurrentIndex(next.length - 1);
          return next;
        });
      } else {
        throw new Error("Invalid flashcard data");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load flashcard";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setIsFlipped(false);
    // If we're at the last card, fetch and append a new one
    if (currentIndex >= flashcards.length - 1) {
      await appendFlashcard();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    if (!loading) {
      setIsFlipped(!isFlipped);
    }
  };

  // Persist deck, index and flip state
  useEffect(() => {
    try { localStorage.setItem(FLASHCARDS_STORAGE_KEYS.DECK, JSON.stringify(flashcards)); } catch (e) { console.warn(e); }
  }, [flashcards]);
  useEffect(() => {
    try { localStorage.setItem(FLASHCARDS_STORAGE_KEYS.INDEX, String(currentIndex)); } catch (e) { console.warn(e); }
  }, [currentIndex]);
  useEffect(() => {
    try { localStorage.setItem(FLASHCARDS_STORAGE_KEYS.FLIPPED, String(isFlipped)); } catch (e) { console.warn(e); }
  }, [isFlipped]);

  const currentCard = flashcards[currentIndex];

  // Loading state
  if (loading && flashcards.length === 0) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <Card className="p-8 max-w-md w-full">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Loading Flashcard</h3>
              <p className="text-sm text-muted-foreground">
                Generating a flashcard from your study material...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Error state with no flashcards
  if (error && flashcards.length === 0) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <Card className="p-8 max-w-md w-full">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Failed to Load</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={appendFlashcard} size="sm">
                  Try Again
                </Button>
                <Button onClick={onClose} variant="outline" size="sm">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // No flashcards available
  if (!currentCard) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-3xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Flashcards</h2>
            <p className="text-muted-foreground">
              AI-generated flashcards from your study material
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative">
          <div
            className="cursor-pointer"
            onClick={handleFlip}
            style={{ perspective: "1000px" }}
          >
            <Card
              className={`relative h-96 transition-transform duration-500 ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front - Question */}
              <div
                className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                    Question
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-6 max-w-2xl">
                  {currentCard.question}
                </h3>
                <p className="text-muted-foreground text-sm">
                  Click to reveal answer
                </p>
              </div>

              {/* Back - Answer */}
              <div
                className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center bg-primary/5 [transform:rotateY(180deg)]"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-success/10 text-success rounded-lg text-sm font-semibold">
                    Answer
                  </span>
                </div>
                <p className="text-lg leading-relaxed max-w-2xl">
                  {currentCard.answer}
                </p>
              </div>
            </Card>
          </div>

          {/* Desktop Navigation Buttons */}
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
              disabled={loading}
              className="rounded-full w-12 h-12"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Controls */}
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-muted-foreground">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFlip}
              disabled={loading}
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Flip
            </Button>
          </div>
        </div>

        {/* Progress Indicators */}
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
