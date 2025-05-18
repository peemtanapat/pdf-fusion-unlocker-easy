
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { Unlock, Files } from "lucide-react";

interface UnlockPDFProps {
  files: File[];
  onClear: () => void;
}

const UnlockPDF: React.FC<UnlockPDFProps> = ({ files, onClear }) => {
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const unlockPDF = async () => {
    if (!files[selectedFileIndex]) {
      toast.error("Please select a PDF file first");
      return;
    }

    if (!password) {
      toast.error("Please enter the PDF password");
      return;
    }

    setIsProcessing(true);

    try {
      // Load the selected PDF file
      const fileArrayBuffer = await files[selectedFileIndex].arrayBuffer();
      
      // Attempt to load the PDF with the provided password
      const pdfDoc = await PDFDocument.load(fileArrayBuffer, { 
        password 
      });

      // If successful, save the PDF without password protection
      const pdfBytes = await pdfDoc.save();
      
      // Create a blob and download link
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      
      // Create a filename by adding "-unlocked" before the extension
      const fileName = files[selectedFileIndex].name;
      const unlockFileName = fileName.replace(".pdf", "-unlocked.pdf");
      
      downloadLink.download = unlockFileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success("PDF unlocked successfully!");
      onClear(); // Clear files after successful unlock
    } catch (error) {
      console.error("Error unlocking PDF:", error);
      toast.error("Failed to unlock PDF. Please check the password and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <div className="mx-auto bg-pdf-blue/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <Unlock className="h-8 w-8 text-pdf-blue" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Unlock PDF</h3>
          <p className="text-gray-600">
            Remove password protection from your PDF files.
          </p>
        </div>

        {files.length > 1 && (
          <div className="mb-4">
            <Label htmlFor="file-select">Select a file to unlock</Label>
            <select
              id="file-select"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setSelectedFileIndex(parseInt(e.target.value))}
              value={selectedFileIndex}
            >
              {files.map((file, index) => (
                <option key={index} value={index}>
                  {file.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Files className="h-5 w-5 mr-2 text-pdf-blue" />
            <span className="truncate font-medium">
              {files[selectedFileIndex]?.name || "No file selected"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="pdf-password">PDF Password</Label>
          <Input
            id="pdf-password"
            type="password"
            placeholder="Enter password to unlock PDF"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={unlockPDF}
            className="bg-pdf-blue hover:bg-pdf-dark-blue text-white"
            disabled={isProcessing || !files[selectedFileIndex] || !password}
          >
            {isProcessing ? "Processing..." : "Unlock PDF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnlockPDF;
