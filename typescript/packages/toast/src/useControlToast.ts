import { useRef } from "react";
import { type ToastDisplayProps } from "./types";
import { generateSecureRandomString } from "@packages/randomizer";

export const useControlToast = () => {
  const id = useRef(generateSecureRandomString());

  const showToast = ({ content }: Omit<ToastDisplayProps, "id">) => {
    const event = new CustomEvent<ToastDisplayProps>("showToast", {
      detail: { id: id.current, content },
    });
    window.dispatchEvent(event);
  };

  const hideToast = () => {
    const event = new CustomEvent<Pick<ToastDisplayProps, "id">>("hideToast", {
      detail: { id: id.current },
    });
    window.dispatchEvent(event);
  };

  return {
    id: id.current,
    showToast,
    hideToast,
  };
};
