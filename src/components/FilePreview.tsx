import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { FileUploadResponse } from "@/types";
import { X } from "lucide-react";

type Props = {
  file: FileUploadResponse;
  removeImage?: (index: string) => void;
};

const FilePreview = ({ file, removeImage }: Props) => {
  return (
    <Link
      href={file.url}
      target="_blank"
      key={file.key}
      className="relative w-full"
    >
      <div className="w-full flex items-center gap-4 border border-borderColor rounded-lg p-2">
        {removeImage && (
          <Button
            variant={"outline"}
            size="icon"
            className="z-10 absolute -right-2 -top-2 w-6 h-6 rounded-full"
            onClick={() => removeImage(file.key)}
          >
            <X className="w-4 h-4 text-gray" />
          </Button>
        )}
        <img src={"/images/pdf.png"} alt="pdf-icon" className="size-10" />
        <div>
          <p className="text-sm">{file.name}</p>
          <p className="text-xs text-secondary-grayText">
            {file.type?.toUpperCase()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FilePreview;
