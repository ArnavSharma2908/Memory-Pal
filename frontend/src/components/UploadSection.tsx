import { useState, useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { uploadPdf } from "@/api";

interface UploadSectionProps {
  onUpload?: (file: File) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const UploadSection = ({ onUpload }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Please upload a PDF file";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 50MB limit";
    }
    return null;
  };

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    uploadFile(file);
  };

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
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    toast.info("Uploading and processing PDF...");

    try {
      await uploadPdf(file);
      toast.success("PDF uploaded successfully! Generating study plan...");
      onUpload?.(file);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
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
            Welcome to Memory-Palo
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Upload your PDF study material and get an AI-powered 7-day adaptive learning plan
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
