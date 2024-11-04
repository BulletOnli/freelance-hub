"use client";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  link: string;
};

const ShareButton = ({ link }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setIsCopied(true);
      toast.info("Link copied to clipboard");
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <Button
      variant="outline"
      className="rounded-full px-4"
      size="sm"
      onClick={handleCopy}
    >
      <Send className="mr-2 size-5" />
      {isCopied ? "Copied!" : "Share"}
    </Button>
  );
};

export default ShareButton;
