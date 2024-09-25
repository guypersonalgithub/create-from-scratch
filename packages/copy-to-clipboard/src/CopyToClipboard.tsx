import { useEffect, useRef, useState } from "react";
import { Button } from "@packages/button";

type CopyToClipboardProps = {
  textToCopy: string;
};

export const CopyToClipboard = ({ textToCopy }: CopyToClipboardProps) => {
  const [copied, setCopied] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (!timeoutRef.current) {
        return;
      }

      clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyToClipboard = () => {
    if (!navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return <Button onClick={() => copyToClipboard()}>{!copied ? "Copy" : "Copied"}</Button>;
};
