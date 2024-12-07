import { CSSProperties, ReactNode, useRef, useEffect } from "react";
import "./styles.css";

type PulseProps = {
  pulseColor?: string;
  children: ReactNode;
};

export const Pulse = ({ pulseColor, children }: PulseProps) => {
  const pulseWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pulseWrapperRef.current) {
      return;
    }

    const firstChild = pulseWrapperRef.current.firstChild as HTMLElement;
    if (!firstChild) {
      return;
    }

    if (!(firstChild instanceof HTMLElement)) {
      return;
    }

    const childBorderRadius = window.getComputedStyle(firstChild).borderRadius;
    pulseWrapperRef.current.style.setProperty("border-radius", childBorderRadius);
  }, [children]);

  return (
    <span
      ref={pulseWrapperRef}
      className="pulseWrapper"
      style={
        {
          "--pulse-color": pulseColor,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
};
