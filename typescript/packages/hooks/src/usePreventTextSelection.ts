import { useEffect } from "react";

export const usePreventTextSelection = () => {
  useEffect(() => {
    const original = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    return () => {
      document.body.style.userSelect = original;
    };
  }, []);
};
