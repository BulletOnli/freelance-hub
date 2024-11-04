"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { Send, Share2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  link: string;
  className?: string;
};

const ShareButton = ({
  link,
  className = "",
  ...props
}: Props & ButtonProps) => {
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
      {...props}
      className={className}
      onClick={handleCopy}
    >
      <Share2 className="mr-2 size-5" />
      {isCopied ? "Copied!" : "Share"}
    </Button>
  );
};

export default ShareButton;
