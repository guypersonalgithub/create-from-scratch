import { useEffect } from "react";

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
