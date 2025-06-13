import { type CSSProperties, type ReactNode, type RefObject } from "react";
import { EdgeIntersection, type EdgeWrapperRefs } from "@packages/edge-intersection";
import { type PopoverDisplayProps } from "./types";

type PopoverContentProps = Pick<PopoverDisplayProps, "offset"> & {
  id: string;
  intersectionRefs: EdgeWrapperRefs;
  style?: CSSProperties;
  show?: () => void;
  children: ReactNode;
  ref: RefObject<HTMLDivElement | null>;
};

export const PopoverContent = ({
  id,
  intersectionRefs,
  offset,
  style = {},
  show,
  children,
  ref,
}: PopoverContentProps) => {
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
};
