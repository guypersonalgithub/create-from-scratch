import { useRef } from "react";
import { TooltipDisplayProps } from "./types";
import { generateSecureRandomString } from "@packages/randomizer";

export const useControlTooltip = () => {
  const id = useRef(generateSecureRandomString());

  const showTooltip = ({
    content,
    side,
    ref,
    offset,
    intersectionRefs,
    distanceFromViewport,
  }: Omit<TooltipDisplayProps, "id">) => {
    const event = new CustomEvent<TooltipDisplayProps>("showTooltip", {
      detail: {
        id: id.current,
        content,
        ref,
        side,
        offset,
        intersectionRefs,
        distanceFromViewport,
      },
    });
    window.dispatchEvent(event);
  };

  const hideTooltip = () => {
    const event = new CustomEvent<Pick<TooltipDisplayProps, "id">>("hideTooltip", {
      detail: { id: id.current },
    });
    window.dispatchEvent(event);
  };

  return {
    id: id.current,
    showTooltip,
    hideTooltip,
  };
};
