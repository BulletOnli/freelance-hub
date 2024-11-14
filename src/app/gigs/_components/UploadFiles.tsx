"use client";
import { useState } from "react";
import { toast } from "sonner";
import { UploadDropzone } from "@/utils/uploadthing";
import { UseFormSetValue } from "react-hook-form";
import { FileUploadResponse } from "@/types";
import FilePreview from "@/components/FilePreview";
import ImagePreview from "@/components/ImagePreview";

type Props = {
  setValue: UseFormSetValue<{
    title: string;
    description: string;
    budget: number;
    deadline: string;
    files?: FileUploadResponse[] | undefined;
  }>;
};

const UploadFiles = ({ setValue }: Props) => {
  const [uploadedImages, setUploadedImages] = useState<FileUploadResponse[]>(
    []
  );

  const handleUploadComplete = (res: FileUploadResponse[]) => {
    setUploadedImages((prevImages) => [...prevImages, ...res]);
    setValue("files", [...uploadedImages, ...res]);
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload failed:", error);
    toast.error("Failed to upload image");
  };

  const removeImage = (key: string) => {
    setUploadedImages((prevImages) =>
      prevImages.filter((image) => image.key !== key)
    );
  };

  return (
    <div className="grid gap-4 py-4">
      <UploadDropzone
        endpoint="fileUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        appearance={{
          button: {
            backgroundColor: "#020617",
          },
          label: {
            color: "#020617",
          },
        }}
      />
      {uploadedImages.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {uploadedImages.map((file) => {
              if (!file.url.endsWith(".pdf")) {
                return (
                  <ImagePreview
                    key={file.key}
                    file={file}
                    removeImage={removeImage}
                  />
                );
              }
            })}
          </div>

          <div className="flex flex-col items-center gap-2">
            {uploadedImages.map((file) => {
              if (file.url.endsWith(".pdf")) {
                return (
                  <FilePreview
                    key={file.key}
                    file={file}
                    removeImage={removeImage}
                  />
                );
              }
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default UploadFiles;
