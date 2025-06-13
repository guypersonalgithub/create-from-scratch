import { useEffect } from "react";

export const useBeforeUnload = () => {
  useEffect(() => {
    const callback = (e: BeforeUnloadEvent) => {
      e.preventDefault(); // Required for Chrome
      e.returnValue = ""; // Required for all modern browsers

      return ""; // Required for some legacy browsers
    };

    window.addEventListener("beforeunload", callback);

    return () => {
      window.removeEventListener("beforeunload", callback);
    };
  }, []);
};
