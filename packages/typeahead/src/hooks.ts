// TODO: Move to a dedicated hooks package.

import { useEffect, useRef } from "react";

export const useClickOutside = ({
  ref,
  onClick,
  isActive,
}: {
  ref: (HTMLElement | null)[];
  onClick: () => void;
  isActive: boolean;
}) => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const clickOutsideElement = (event: MouseEvent): void => {
      for (let i = 0; i < ref.length; i++) {
        if (!ref[i]) {
          continue;
        }

        if (ref[i]?.contains(event.target as Node | null)) {
          return;
        }
      }

      event.preventDefault();
      event.stopPropagation();

      onClick();
    };

    document.addEventListener("click", clickOutsideElement, true);

    return () => {
      document.removeEventListener("click", clickOutsideElement, true);
    };
  }, [ref, onClick, isActive]);
};

export const useDebounce = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const clear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
