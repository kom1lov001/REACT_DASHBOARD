
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Upload, X, FileText, Image, File } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size?: string;
  uploadDate?: string;
  url?: string;
}

interface DocumentViewerProps {
  documents: Document[];
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (files: FileList, category: string) => void;
  onDownload?: (document: Document) => void;
  onPreview?: (document: Document) => void;
  isEditable?: boolean;
}

const documentCategories = [
  "Appointment Letter",
  "Salary Slip",
  "Relieving Letter", 
  "Experience Letter",
  "ID Card",
  "Passport",
  "Contract",
  "Other"
];

const DocumentViewer = ({ 
  documents, 
  isOpen, 
  onClose, 
  onUpload, 
  onDownload, 
  onPreview,
  isEditable = false 
}: DocumentViewerProps) => {
  const [selectedCategory, setSelectedCategory] = useState("Appointment Letter");
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);

  const getFileIcon = (type: string) => {
    if (type.toLowerCase().includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.toLowerCase().includes('image')) return <Image className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Appointment Letter": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Salary Slip": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Relieving Letter": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Experience Letter": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleUpload = () => {
    if (!uploadFiles || uploadFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    if (onUpload) {
      onUpload(uploadFiles, selectedCategory);
      toast.success(`${uploadFiles.length} file(s) uploaded successfully`);
      setUploadFiles(null);
    }
  };

  const handlePreview = (doc: Document) => {
    if (onPreview) {
      onPreview(doc);
    } else {
      toast("Preview functionality not implemented");
    }
  };

  const handleDownload = (doc: Document) => {
    if (onDownload) {
      onDownload(doc);
    } else {
      toast.success(`Downloading ${doc.name}`);
    }
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Employee Documents
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {/* Upload Section (if editable) */}
            {isEditable && (
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Upload New Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground">Document Category</Label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    >
                      {documentCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-foreground">Select Files</Label>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setUploadFiles(e.target.files)}
                      className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleUpload} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Documents
                  </Button>
                </div>
              </div>
            )}

            {/* Documents Display */}
            <div className="space-y-6">
              {Object.entries(groupedDocuments).map(([category, docs]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                    <Badge className={getCategoryColor(category)}>
                      {docs.length} file{docs.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {docs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)}
                          <div>
                            <p className="font-medium text-foreground">{doc.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{doc.type}</span>
                              {doc.size && <span>{doc.size}</span>}
                              {doc.uploadDate && <span>Uploaded: {doc.uploadDate}</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(doc)}
                            className="hover:bg-blue-50 dark:hover:bg-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            className="hover:bg-green-50 dark:hover:bg-green-900"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {documents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No documents uploaded yet</p>
                  {isEditable && <p className="text-sm">Use the upload section above to add documents</p>}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
