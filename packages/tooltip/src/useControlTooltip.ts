import { useMemo } from "react";
import { TooltipDisplayProps } from "./types";
import { generateSecureRandomString } from "@packages/randomizer";

export const useControlTooltip = () => {
  const id = useMemo(() => {
    return generateSecureRandomString();
  }, []);

  const showTooltip = ({ content, ref, offset }: Omit<TooltipDisplayProps, "id">) => {
    const event = new CustomEvent<TooltipDisplayProps>("showTooltip", {
      detail: { id, content, ref, offset },
    });
    window.dispatchEvent(event);
  };

  const hideTooltip = () => {
    const event = new CustomEvent<Pick<TooltipDisplayProps, "id">>("hideTooltip", {
      detail: { id },
    });
    window.dispatchEvent(event);
  };

  return {
    showTooltip,
    hideTooltip,
  };
};
