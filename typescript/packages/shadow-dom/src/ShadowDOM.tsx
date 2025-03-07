import { ReactNode, useEffect, useRef } from "react";

type ShadowDOMProps = {
  children: ReactNode;
};

export const ShadowDOM = ({ children }: ShadowDOMProps) => {
  const shadowRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    if (!shadowRef.current) {
      return;
    }

    if (!shadowRootRef.current) {
      shadowRootRef.current = shadowRef.current.attachShadow({ mode: "open" });
    }
  }, []);

  return <div ref={shadowRef}>{children}</div>;
};
