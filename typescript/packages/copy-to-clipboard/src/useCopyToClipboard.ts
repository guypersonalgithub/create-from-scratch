import { useState } from "react";
import { useDebounce } from "@packages/hooks";

type UseCopyToClipboardArgs = {
  textToCopy: string;
  delay?: number;
};

export const useCopyToClipboard = ({ textToCopy, delay = 1000 }: UseCopyToClipboardArgs) => {
  const [copied, setCopied] = useState<boolean>(false);
  const { set } = useDebounce();

  const copyToClipboard = () => {
    if (!navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    set({
      callback: () => {
        setCopied(false);
      },
      delay,
    });
  };

  return {
    copied,
    copyToClipboard,
  };
};
