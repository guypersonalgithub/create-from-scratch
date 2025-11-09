import { type CSSProperties, type ReactNode, useRef, useEffect } from "react";
import "./styles.css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type PulseProps = {
  className?: string;
  style?: CSSProperties;
  pulseColor?: string;
  children: ReactNode;
};

export const Pulse = ({
  className,
  style,
  pulseColor = "rgba(0, 0, 0, 0.7)",
  children,
}: PulseProps) => {
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
      className={combineStringsWithSpaces(
        dynatic`
          position: relative;
          display: inline-block;
          --pulse-color: ${pulseColor};

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            animation: pulseAnimation 2s infinite;
            z-index: -1;
          }
        `,
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
};
