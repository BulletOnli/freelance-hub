import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { FileUploadResponse } from "@/types";

type Props = {
  file: FileUploadResponse;
  removeImage?: (index: string) => void;
};

const ImagePreview = ({ file, removeImage }: Props) => {
  return (
    <Link href={file.url} target="_blank" key={file.key}>
      <div className="relative group ">
        <img
          src={file.url}
          alt={file.name}
          className="size-20 object-cover rounded-md"
        />
        {removeImage && (
          <Button
            variant="secondary"
            size="icon"
            className="z-10 size-5 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeImage(file.key)}
          >
            <X className="size-3" />
          </Button>
        )}
      </div>
    </Link>
  );
};

export default ImagePreview;
