import { useMemo } from "react";
import { ToastDisplayProps } from "./types";
import { generateSecureRandomString } from "@packages/randomizer";

export const useControlToast = () => {
  const id = useMemo(() => {
    return generateSecureRandomString();
  }, []);

  const showToast = ({ content }: Omit<ToastDisplayProps, "id">) => {
    const event = new CustomEvent<ToastDisplayProps>("showToast", {
      detail: { id, content },
    });
    window.dispatchEvent(event);
  };

  const hideToast = () => {
    const event = new CustomEvent<Pick<ToastDisplayProps, "id">>("hideToast", {
      detail: { id },
    });
    window.dispatchEvent(event);
  };

  return {
    showToast,
    hideToast,
    id,
  };
};
