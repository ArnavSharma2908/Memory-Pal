import { useState, useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface UploadSectionProps {
  onUpload?: (file: File) => void;
}

export const UploadSection = ({ onUpload }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL = "http://127.0.0.1:8000/upload-pdf";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      uploadFile(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      uploadFile(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const uploadFile = async (file: File) => {
  setIsUploading(true);
  toast.info("Uploading file... Please wait.");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);
    setIsUploading(false);

    if (response.ok) {
      toast.success("File uploaded successfully!");
      const data = await response.json();
      console.log("Server response:", data);
      if (onUpload) onUpload(file);
    } else {
      const errorText = await response.text();
      toast.error(`Upload failed: ${errorText || response.statusText}`);
    }
  } catch (error) {
    setIsUploading(false);

    // ✅ Properly narrow the error type
    if (error instanceof DOMException && error.name === "AbortError") {
      toast.error("Request timed out. Server took too long to respond.");
    } else if (error instanceof TypeError) {
      toast.error("Network error. Please check your connection.");
    } else {
      console.error("Upload error:", error);
      toast.error("Unexpected error occurred during upload.");
    }
  }
};


  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
            <FileText className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Welcome to StudyMaster
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Upload your study material and let our adaptive learning system create
            a personalized 7-day study plan just for you.
          </p>
        </div>

        <Card
          className={`p-12 border-2 border-dashed transition-all cursor-pointer hover:border-primary hover:bg-muted/50 ${
            isDragging ? "border-primary bg-muted/50 scale-105" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="p-6 rounded-full bg-primary/10">
              <Upload className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold">
                {isUploading
                  ? "Uploading... please wait"
                  : "Drop your PDF here or click to browse"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supported format: PDF (Max 50MB)
              </p>
            </div>
            <Button
              variant="default"
              size="lg"
              className="mt-4"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Choose File"}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </Card>

        <div className="grid grid-cols-3 gap-4 pt-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-2">7</div>
            <p className="text-sm text-muted-foreground">Day Study Plan</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-success mb-2">∞</div>
            <p className="text-sm text-muted-foreground">Smart Flashcards</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-glow mb-2">AI</div>
            <p className="text-sm text-muted-foreground">Adaptive Testing</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
