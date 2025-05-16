import { useRef } from "react";
import { PopoverDisplayProps } from "./types";
import { generateSecureRandomString } from "@packages/randomizer";

export const useControlPopover = () => {
  const id = useRef(generateSecureRandomString());

  const showPopover = ({
    content,
    side,
    ref,
    offset,
    intersectionRefs,
    distanceFromViewport,
    style,
  }: Omit<PopoverDisplayProps, "id">) => {
    const event = new CustomEvent<PopoverDisplayProps>("showPopover", {
      detail: {
        id: id.current,
        content,
        ref,
        side,
        offset,
        intersectionRefs,
        distanceFromViewport,
        style,
      },
    });
    window.dispatchEvent(event);
  };

  const hidePopover = () => {
    const event = new CustomEvent<Pick<PopoverDisplayProps, "id">>("hidePopover", {
      detail: { id: id.current },
    });
    window.dispatchEvent(event);
  };

  return {
    id: id.current,
    showPopover,
    hidePopover,
  };
};
