import { useEffect, useRef } from "react";

export const useDebounce = () => {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const clear = () => {
    if (!timeoutRef.current) {
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const set = ({ callback, delay }: { callback: () => void; delay: number }) => {
    clear();
    timeoutRef.current = setTimeout(() => callback(), delay);
  };

  useEffect(() => {
    return () => clear();
  }, []);

  return { set, clear };
};
