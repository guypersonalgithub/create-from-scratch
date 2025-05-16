import { CSSProperties, forwardRef, ReactNode } from "react";
import { EdgeIntersection, type EdgeWrapperRefs } from "@packages/edge-intersection";
import { PopoverDisplayProps } from "./types";

type PopoverContentProps = Pick<PopoverDisplayProps, "offset"> & {
  id: string;
  intersectionRefs: EdgeWrapperRefs;
  style?: CSSProperties;
  show?: () => void;
  children: ReactNode;
};

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ id, intersectionRefs, offset, style = {}, show, children }, ref) => {
    return (
      <EdgeIntersection
        id={id}
        style={{
          height: "fit-content",
          ...style,
        }}
        intersectionRefs={intersectionRefs}
        offset={offset}
      >
        <div
          ref={ref}
          style={{
            height: "fit-content",
            ...style,
          }}
          onClick={show}
        >
          {children}
        </div>
      </EdgeIntersection>
    );
  },
);
