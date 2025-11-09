import { type CSSProperties, type ReactNode, type RefObject } from "react";
import { EdgeIntersection, type EdgeWrapperRefs } from "@packages/edge-intersection";
import { type TooltipDisplayProps } from "./types";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type TooltipContentProps = Pick<TooltipDisplayProps, "offset"> & {
  id: string;
  intersectionRefs: EdgeWrapperRefs;
  className?: string;
  style?: CSSProperties;
  isEllipsizedCallback?: () => boolean;
  show?: () => void;
  hide?: () => void;
  children: ReactNode;
  ref: RefObject<HTMLDivElement | null>;
};

export const TooltipContent = ({
  id,
  intersectionRefs,
  offset,
  isEllipsizedCallback,
  className,
  style = {},
  show,
  hide,
  children,
  ref,
}: TooltipContentProps) => {
  return (
    <EdgeIntersection
      id={id}
      style={{
        height: "fit-content",
        ...style,
      }}
      childrenWrapperStyle={isEllipsizedCallback ? { overflow: "hidden" } : undefined}
      intersectionRefs={intersectionRefs}
      offset={offset}
    >
      <div
        ref={ref}
        className={combineStringsWithSpaces(
          dynatic`
            height: fit-content;
          `,
          className,
        )}
        style={style}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </div>
    </EdgeIntersection>
  );
};
