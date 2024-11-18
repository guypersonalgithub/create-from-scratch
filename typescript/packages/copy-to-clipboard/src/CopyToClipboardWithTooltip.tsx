import { Button } from "@packages/button";
import { useCopyToClipboard } from "./useCopyToClipboard";
import { AutomaticTooltip, TooltipProps } from "@packages/tooltip";
import { ReactNode } from "react";

type CopyToClipboardWithTooltipProps = Omit<TooltipProps, "content" | "disabled" | "children"> & {
  textToCopy: string;
  delay?: number;
  children: ReactNode;
};

export const CopyToClipboardWithTooltip = ({
  textToCopy,
  delay,
  children,
  ...tooltipProps
}: CopyToClipboardWithTooltipProps) => {
  const { copied, copyToClipboard } = useCopyToClipboard({ textToCopy, delay });

  return (
    <AutomaticTooltip {...tooltipProps} disabled={!copied} content="Copied">
      <Button onClick={() => copyToClipboard()}>{children}</Button>
    </AutomaticTooltip>
  );
};
