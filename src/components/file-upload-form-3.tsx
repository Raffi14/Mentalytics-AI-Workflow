"use client";

import { Upload, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

type Props = {
  files: File[];
  setFiles: (files: File[]) => void;
  setError: React.Dispatch<
  React.SetStateAction<{
    fileError: string | null;
    promptError: string | null;
  }>
>;
};

const InputFile = ({ files, setFiles, setError }: Props) => {
  const isDisabled = files.length >= 1;

  const handleFilesChange = (newFiles: File[]) => {
    if (isDisabled) return;

    setFiles(newFiles);

    if (newFiles.length > 0) {
      setError((prev : { fileError: string | null; promptError: string | null }) => ({ ...prev, fileError: null }));
    }
  };

  const handleRemoveFile = () => {
    setFiles([]);
    setError((prev : { fileError: string | null; promptError: string | null }) => ({ ...prev, fileError: "Please upload a document" }));
  };

  return (
    <div className="w-full space-y-4">
      <Label>
        Upload Document <span className="text-destructive">*</span>
      </Label>

      <FileUpload
        value={files}
        onValueChange={handleFilesChange}
        maxFiles={1}
        maxSize={10 * 1024 * 1024}
        accept=".pdf,.doc,.docx, .png, .jpg, .jpeg"
        disabled={isDisabled}
      >
        <FileUploadDropzone
          className={isDisabled ? "opacity-60 cursor-not-allowed" : ""}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">
              {isDisabled ? "File uploaded" : "Upload your document"}
            </p>

            <p className="text-xs text-muted-foreground">
              PDF, DOC, DOCX (max 10MB)
            </p>
          </div>

          <FileUploadTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-black"
              disabled={isDisabled}
            >
              Select File
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>

        <FileUploadList>
          {files.map((file, index) => (
            <FileUploadItem key={index} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />

              <FileUploadItemDelete asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={handleRemoveFile}
                >
                  <X className="size-4" />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    </div>
  );
};

export default InputFile;