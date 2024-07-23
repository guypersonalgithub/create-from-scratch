import { useEffect, useRef } from "react";

export const useIsDev = () => {
  const isDev = useRef(location.origin.includes("localhost"));

  useEffect(() => {
    return () => {
      isDev.current = false;
    };
  }, []);

  return {
    isDev: isDev.current,
  };
};
