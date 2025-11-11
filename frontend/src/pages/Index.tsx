import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadSection } from "@/components/UploadSection";
import { StudyDashboard } from "@/components/StudyDashboard";
import { Quiz } from "@/components/Quiz";
import { Flashcard } from "@/components/Flashcard";
import { toast } from "sonner";
import { ThemeProvider } from "next-themes";
import { Question } from "@/types";

type AppView = "upload" | "dashboard" | "quiz" | "flashcards";

const Index = () => {
  // Check if this is a new session (app restart) or just a page refresh
  const isNewSession = !sessionStorage.getItem("appSession");
  
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (isNewSession) {
      // New session: start from upload page
      return "upload";
    }
    // Page refresh: restore previous view
    const saved = localStorage.getItem("currentView");
    return (saved as AppView) || "upload";
  });
  const [textSize, setTextSize] = useState(1);
  const [currentTestDay, setCurrentTestDay] = useState<number>(1);
  const [studyEnded, setStudyEnded] = useState(() => {
    if (isNewSession) return false;
    const saved = localStorage.getItem("studyEnded");
    return saved === "true";
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(() => {
    if (isNewSession) return null;
    const saved = localStorage.getItem("uploadedFileName");
    return saved ? { name: saved } as File : null;
  });
  const [completedTests, setCompletedTests] = useState<number[]>(() => {
    if (isNewSession) return [];
    const saved = localStorage.getItem("completedTests");
    return saved ? JSON.parse(saved) : [];
  });
  const [testScores, setTestScores] = useState<Record<number, number>>(() => {
    if (isNewSession) return {};
    const saved = localStorage.getItem("testScores");
    return saved ? JSON.parse(saved) : {};
  });
  const [testResults, setTestResults] = useState<Record<number, { questions: Question[], answers: (number | null)[] }>>(() => {
    if (isNewSession) return {};
    const saved = localStorage.getItem("testResults");
    return saved ? JSON.parse(saved) : {};
  });
  const [reviewTestDay, setReviewTestDay] = useState<number | null>(null);

  // Set session marker on mount and clear old data if new session
  useEffect(() => {
    if (isNewSession) {
      // Clear all localStorage data for a fresh start
      localStorage.removeItem("currentView");
      localStorage.removeItem("studyEnded");
      localStorage.removeItem("uploadedFileName");
      localStorage.removeItem("completedTests");
      localStorage.removeItem("testScores");
      localStorage.removeItem("testResults");
    }
    sessionStorage.setItem("appSession", "active");
  }, [isNewSession]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem("studyEnded", studyEnded.toString());
  }, [studyEnded]);

  useEffect(() => {
    if (uploadedFile) {
      localStorage.setItem("uploadedFileName", uploadedFile.name);
    } else {
      localStorage.removeItem("uploadedFileName");
    }
  }, [uploadedFile]);

  useEffect(() => {
    localStorage.setItem("completedTests", JSON.stringify(completedTests));
  }, [completedTests]);

  useEffect(() => {
    localStorage.setItem("testScores", JSON.stringify(testScores));
  }, [testScores]);

  useEffect(() => {
    localStorage.setItem("testResults", JSON.stringify(testResults));
  }, [testResults]);

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    toast.success("PDF uploaded successfully! Generating your study plan...");
    // Simulate processing
    setTimeout(() => {
      setCurrentView("dashboard");
      toast.success("Your 7-day study plan is ready!");
    }, 2000);
  };

  const handleStartTest = (day: number) => {
    setCurrentTestDay(day);
    setReviewTestDay(null);
    setCurrentView("quiz");
  };

  const handleReviewTest = (day: number) => {
    setCurrentTestDay(day);
    setReviewTestDay(day);
    setCurrentView("quiz");
  };

  const handleQuizComplete = (score: number, questions: Question[], answers: (number | null)[]) => {
    toast.success(`Test completed! Your score: ${score}%`);
    // Mark current test as completed and store score and results
    setCompletedTests((prev) => [...prev, currentTestDay]);
    setTestScores((prev) => ({ ...prev, [currentTestDay]: score }));
    setTestResults((prev) => ({ ...prev, [currentTestDay]: { questions, answers } }));
    setCurrentView("dashboard");
  };

  const handleOpenFlashcards = () => {
    setCurrentView("flashcards");
  };

  const handleCloseFlashcards = () => {
    setCurrentView("dashboard");
  };

  const handleEndStudy = () => {
    setStudyEnded(true);
    toast.success("Study ended! Flashcards now show equal distribution across all topics.");
  };

  const handleDeleteStudy = () => {
    if (confirm("Are you sure you want to delete this study? This action cannot be undone.")) {
      setCurrentView("upload");
      setUploadedFile(null);
      setStudyEnded(false);
      setCompletedTests([]);
      setTestScores({});
      setTestResults({});
      // Clear localStorage
      localStorage.removeItem("currentView");
      localStorage.removeItem("uploadedFileName");
      localStorage.removeItem("studyEnded");
      localStorage.removeItem("completedTests");
      localStorage.removeItem("testScores");
      localStorage.removeItem("testResults");
      toast.success("Study deleted successfully");
    }
  };

  // Check if all tests are completed
  const allTestsCompleted = completedTests.length === 7;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div style={{ fontSize: `${textSize}rem` }} className="min-h-screen bg-background">
        {currentView !== "upload" && (
          <Navbar
            showEndStudy={allTestsCompleted && !studyEnded}
            onEndStudy={handleEndStudy}
            onDeleteStudy={handleDeleteStudy}
            textSize={textSize}
            onTextSizeChange={setTextSize}
          />
        )}

        {currentView === "upload" && <UploadSection onUpload={handleUpload} />}

        {currentView === "dashboard" && (
          <StudyDashboard
            onStartTest={handleStartTest}
            onReviewTest={handleReviewTest}
            onOpenFlashcards={handleOpenFlashcards}
            studyTitle={uploadedFile?.name.replace(".pdf", "")}
            completedTests={completedTests}
            testScores={testScores}
          />
        )}

        {currentView === "quiz" && (
          <Quiz
            day={reviewTestDay ?? currentTestDay}
            onComplete={handleQuizComplete}
            onBack={() => {
              setReviewTestDay(null);
              setCurrentView("dashboard");
            }}
            reviewMode={reviewTestDay !== null}
            savedQuestions={reviewTestDay !== null ? testResults[reviewTestDay]?.questions : undefined}
            savedAnswers={reviewTestDay !== null ? testResults[reviewTestDay]?.answers : undefined}
          />
        )}

        {currentView === "flashcards" && (
          <Flashcard onClose={handleCloseFlashcards} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
