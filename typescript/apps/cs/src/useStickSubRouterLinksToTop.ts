import { useLayoutEffect, useRef } from "react";

export const useStickSubRouterLinksToTop = () => {
  const ref = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current || !childRef.current) {
      return;
    }

    const { top } = ref.current.getBoundingClientRect();
    childRef.current.style.top = `${top}px`;
  }, []);

  return { ref, childRef };
};
