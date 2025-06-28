
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText, Image, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface UploadedFile {
  id: string;
  file: File;
  category: string;
  preview?: string;
}

interface DocumentUploadProps {
  category: string;
  title: string;
  acceptedTypes?: string;
  onFilesChange?: (files: UploadedFile[]) => void;
  initialFiles?: UploadedFile[];
}

const DocumentUpload = ({ 
  category, 
  title, 
  acceptedTypes = ".doc,.pdf,.jpg,.jpeg,.png", 
  onFilesChange,
  initialFiles = []
}: DocumentUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialFiles);
  const [isDragOver, setIsDragOver] = useState(false);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return <Image className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    Array.from(files).forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      newFiles.push({
        id,
        file,
        category,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      });
    });

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    toast.success(`${files.length} file(s) added successfully`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    toast.success("File removed");
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{title}</Label>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 lg:p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Drag & Drop or{" "}
          <label className="text-purple-600 cursor-pointer hover:underline">
            choose file
            <Input
              type="file"
              multiple
              accept={acceptedTypes}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </label>
          {" "}to upload
        </p>
        <p className="text-xs text-gray-500">
          Supported formats: {acceptedTypes.replace(/\./g, '').toUpperCase()}
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Uploaded Files ({uploadedFiles.length})
          </p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {uploadedFiles.map((uploadedFile) => (
              <Card key={uploadedFile.id} className="dark:bg-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(uploadedFile.file.name)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {uploadedFile.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {uploadedFile.file.type || 'Unknown'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(uploadedFile.file.size)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.id)}
                      className="hover:bg-red-50 dark:hover:bg-red-900 text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
