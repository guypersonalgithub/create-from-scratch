import { useRef, useEffect } from "react";

export const useThrottle = () => {
  const lastCall = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (!timeoutRef.current) {
      return;
    }

      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
  };

  const set = ({ callback, delay }: { callback: () => void; delay: number }) => {
    const now = Date.now();

    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback();
    } else {
      clear();

      timeoutRef.current = setTimeout(
        () => {
          lastCall.current = Date.now();
          callback();
        },
        delay - (now - lastCall.current),
      );
    }
  };

  useEffect(() => {
    return () => clear();
  }, []);

  return { set, clear };
};
