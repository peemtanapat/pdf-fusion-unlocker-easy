
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PDFUploader from "@/components/PDFUploader";
import MergePDF from "@/components/MergePDF";
import UnlockPDF from "@/components/UnlockPDF";
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
          <h1 className="text-4xl font-bold text-pdf-dark-blue mb-2">PDF Utility</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Easily manage your PDF files with our simple tools. Merge multiple PDFs into one or unlock password-protected files.
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
            
            <Tabs defaultValue="merge" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="merge">Merge PDFs</TabsTrigger>
                <TabsTrigger value="unlock">Unlock PDF</TabsTrigger>
              </TabsList>
              <TabsContent value="merge">
                <MergePDF files={files} onClear={clearFiles} />
              </TabsContent>
              <TabsContent value="unlock">
                <UnlockPDF files={files} onClear={clearFiles} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} PDF Utility. All rights reserved.</p>
        </footer>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
