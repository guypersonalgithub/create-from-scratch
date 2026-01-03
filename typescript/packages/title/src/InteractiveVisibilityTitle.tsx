import { observeElementVisibility } from "@packages/element-utils";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

export type InteractiveVisibilityTitleProps = {
  className?: string;
  style?: CSSProperties;
  underlineClassName?: string;
  underlineStyle?: CSSProperties;
  children: ReactNode;
};

export const InteractiveVisibilityTitle = ({
  className,
  style,
  underlineClassName,
  underlineStyle,
  children,
}: InteractiveVisibilityTitleProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = observeElementVisibility({
      element,
      observerCallback: ({ isIntersection }) => {
        const baseWidth = dynatic`
          transform: scaleX(0%);
        `;

        const finalWidth = dynatic`
          transform: scaleX(100%);
        `;

        if (isIntersection) {
          element.classList.remove(baseWidth);
          element.classList.add(finalWidth);
        } else {
          element.classList.remove(finalWidth);
          element.classList.add(baseWidth);
        }
      },
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          width: fit-content;
        `,
        className,
      )}
      style={style}
    >
      {children}
      <div
        ref={ref}
        className={combineStringsWithSpaces(
          dynatic`
            transform-origin: left;
            transform: scaleX(0%);
            transition: transform 0.5s ease;
          `,
          underlineClassName,
        )}
        style={underlineStyle}
      />
    </div>
  );
};
