
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Files } from "lucide-react";

interface PDFUploaderProps {
  onFilesSelected: (files: File[]) => void;
  files: File[];
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onFilesSelected, files }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Check if all files are PDFs
      const allPdfs = acceptedFiles.every((file) => file.type === "application/pdf");
      
      if (!allPdfs) {
        toast.error("Please upload only PDF files");
        return;
      }
      
      onFilesSelected([...files, ...acceptedFiles]);
      
      if (acceptedFiles.length > 0) {
        toast.success(`${acceptedFiles.length} PDF${acceptedFiles.length > 1 ? 's' : ''} uploaded successfully`);
      }
    },
    [files, onFilesSelected]
  );

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesSelected(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  const clearAllFiles = () => {
    onFilesSelected([]);
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragActive
            ? "bg-pdf-light-blue/20 border-pdf-blue"
            : "bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Files className="w-12 h-12 mx-auto mb-4 text-pdf-blue" />
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-gray-700">
            {isDragActive ? "Drop your PDF files here" : "Drag & drop PDF files here"}
          </h3>
          <p className="text-gray-500">or</p>
          <Button variant="outline" type="button" className="bg-white hover:bg-gray-100">
            Browse files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">
              Uploaded Files ({files.length})
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFiles}
              className="text-gray-500 hover:text-red-500"
            >
              Clear All
            </Button>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-pdf-blue mr-2">
                    <Files size={20} />
                  </span>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
