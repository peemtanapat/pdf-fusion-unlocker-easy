
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { Merge } from "lucide-react";

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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Merge</h3>
          <p className="text-gray-600">
            You have {files.length} PDF file{files.length !== 1 ? 's' : ''} ready to merge. Drag and drop to reorder them before merging.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <span>Processing Order</span>
            <span className="text-xs text-gray-500 font-normal">(Files will be merged in this order)</span>
          </h4>
          <div className="text-sm text-gray-600">
            <ol className="list-decimal pl-5 space-y-1">
              {files.map((file, index) => (
                <li key={index} className="pl-1">
                  <span className="font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={mergePDFs}
            className="bg-pdf-blue hover:bg-pdf-dark-blue text-white px-8 py-2 text-lg"
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
