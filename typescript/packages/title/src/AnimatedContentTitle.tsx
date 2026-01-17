import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type AnimatedContentTitleProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export const AnimatedContentTitle = ({ className, style, children }: AnimatedContentTitleProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const { backgroundPosition } = element.style;
    const [xAxis, yAxis] = backgroundPosition.split(" ");
    let xAxisValue = parseFloat(xAxis);

    const interval = setInterval(() => {
      xAxisValue = (xAxisValue + 1) % 200;
      element.style.backgroundPosition = `${xAxisValue}% ${yAxis}`;
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      ref={ref}
      className={combineStringsWithSpaces(
        dynatic`
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
        `,
        className,
      )}
      style={{ ...style, backgroundPosition: "0 0" }}
    >
      {children}
    </span>
  );
};
