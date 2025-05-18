
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { Files, Merge } from "lucide-react";

interface MergePDFProps {
  files: File[];
  onClear: () => void;
}

const MergePDF: React.FC<MergePDFProps> = ({ files, onClear }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error("Please upload at least two PDF files to merge");
      return;
    }

    setIsProcessing(true);
    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Load each PDF file and copy its pages to the merged PDF
      for (const file of files) {
        try {
          const fileArrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(fileArrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          toast.error(`Failed to process ${file.name}. It might be corrupted or invalid.`);
        }
      }

      // Save and download the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      
      // Create a blob from the bytes
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      
      // Create a download link and trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "merged.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success("PDFs merged successfully!");
      onClear(); // Clear files after successful merge
    } catch (error) {
      console.error("Error merging PDFs:", error);
      toast.error("Failed to merge PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <div className="mx-auto bg-pdf-blue/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <Merge className="h-8 w-8 text-pdf-blue" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Merge PDFs</h3>
          <p className="text-gray-600">
            Combine multiple PDF files into a single document.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Files to merge: {files.length}</h4>
          <ul className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
            {files.map((file, index) => (
              <li key={index} className="flex items-center">
                <Files className="h-4 w-4 mr-2 text-pdf-blue" />
                <span className="truncate">{file.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={mergePDFs}
            className="bg-pdf-blue hover:bg-pdf-dark-blue text-white"
            disabled={isProcessing || files.length < 2}
          >
            {isProcessing ? "Processing..." : "Merge PDFs"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MergePDF;
