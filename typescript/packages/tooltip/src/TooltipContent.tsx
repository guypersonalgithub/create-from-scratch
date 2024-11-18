import { CSSProperties, forwardRef, ReactNode } from "react";
import { EdgeIntersection, type EdgeWrapperRefs } from "@packages/edge-intersection";
import { TooltipDisplayProps } from "./types";

type TooltipContentProps = Pick<TooltipDisplayProps, "offset"> & {
  id: string;
  intersectionRefs: EdgeWrapperRefs;
  style?: CSSProperties;
  isEllipsizedCallback?: () => boolean;
  show?: () => void;
  hide?: () => void;
  children: ReactNode;
};

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    { id, intersectionRefs, offset, isEllipsizedCallback, style = {}, show, hide, children },
    ref,
  ) => {
    return (
      <EdgeIntersection
        id={id}
        style={{
          width: isEllipsizedCallback ? "inherit" : "fit-content",
          height: "fit-content",
          ...style,
        }}
        intersectionRefs={intersectionRefs}
        offset={offset}
      >
        <div
          ref={ref}
          style={{
            width: isEllipsizedCallback ? "inherit" : "fit-content",
            height: "fit-content",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            ...style,
          }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {children}
        </div>
      </EdgeIntersection>
    );
  },
);
