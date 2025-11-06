import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadSection } from "@/components/UploadSection";
import { StudyDashboard } from "@/components/StudyDashboard";
import { Quiz } from "@/components/Quiz";
import { Flashcard } from "@/components/Flashcard";
import { toast } from "sonner";
import { ThemeProvider } from "next-themes";

type AppView = "upload" | "dashboard" | "quiz" | "flashcards";

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>("upload");
  const [textSize, setTextSize] = useState(1);
  const [currentTestDay, setCurrentTestDay] = useState<number>(1);
  const [studyEnded, setStudyEnded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
    setCurrentView("quiz");
  };

  const handleQuizComplete = (score: number) => {
    toast.success(`Test completed! Your score: ${score}%`);
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
      toast.success("Study deleted successfully");
    }
  };

  // Check if all tests are completed (mock logic)
  const allTestsCompleted = false; // In real app, this would check actual test completion

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
            onOpenFlashcards={handleOpenFlashcards}
            studyTitle={uploadedFile?.name.replace(".pdf", "")}
          />
        )}

        {currentView === "quiz" && (
          <Quiz
            day={currentTestDay}
            onComplete={handleQuizComplete}
            onBack={() => setCurrentView("dashboard")}
          />
        )}

        {currentView === "flashcards" && (
          <Flashcard
            onClose={handleCloseFlashcards}
            adaptiveMode={!studyEnded}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
