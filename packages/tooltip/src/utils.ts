import { TooltipDisplayProps } from "./types";

export const showTooltip = ({ id, content, ref, offset }: TooltipDisplayProps) => {
  const event = new CustomEvent<TooltipDisplayProps>("showTooltip", {
    detail: { id, content, ref, offset },
  });
  window.dispatchEvent(event);
};

type HideTooltipArgs = {
  id: string;
};

export const hideTooltip = ({ id }: HideTooltipArgs) => {
  const event = new CustomEvent<Pick<TooltipDisplayProps, "id">>("hideTooltip", {
    detail: { id },
  });
  window.dispatchEvent(event);
};
