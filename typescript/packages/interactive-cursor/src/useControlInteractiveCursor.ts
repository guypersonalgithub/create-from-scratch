import { type InteractiveCursorProperties } from "./types";

export const useControlInteractiveCursor = () => {
  const enableInteractiveCursor = () => {
    const event = new CustomEvent("enableInteractiveCursor");
    window.dispatchEvent(event);
  };

  const disableInteractiveCursor = () => {
    const event = new CustomEvent("disableInteractiveCursor");
    window.dispatchEvent(event);
  };

  const updateClassNamesOrStyle = ({ className, style }: InteractiveCursorProperties) => {
    const event = new CustomEvent<InteractiveCursorProperties>("updateClassNamesOrStyle", {
      detail: {
        className,
        style,
      },
    });
    window.dispatchEvent(event);
  };

  return {
    enableInteractiveCursor,
    disableInteractiveCursor,
    updateClassNamesOrStyle,
  };
};
