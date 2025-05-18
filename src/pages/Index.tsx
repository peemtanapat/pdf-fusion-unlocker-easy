
import { useState } from "react";
import PDFUploader from "@/components/PDFUploader";
import MergePDF from "@/components/MergePDF";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  
  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pdf-dark-blue mb-2">PDF Merger</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Easily combine multiple PDF files into a single document. Drag and drop to reorder your files before merging.
          </p>
        </header>

        <PDFUploader onFilesSelected={handleFilesSelected} files={files} />
        
        {files.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFiles}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Files
              </Button>
            </div>
            
            <MergePDF files={files} onClear={clearFiles} />
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} PDF Merger. All rights reserved.</p>
        </footer>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
