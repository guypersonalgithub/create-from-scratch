import { type CSSProperties, type ReactNode, type RefObject } from "react";
import { EdgeIntersection, type EdgeWrapperRefs } from "@packages/edge-intersection";
import { type PopoverDisplayProps } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type PopoverContentProps = Pick<PopoverDisplayProps, "offset"> & {
  id: string;
  intersectionRefs: EdgeWrapperRefs;
  className?: string;
  style?: CSSProperties;
  show?: () => void;
  children: ReactNode;
  ref: RefObject<HTMLDivElement | null>;
};

export const PopoverContent = ({
  id,
  intersectionRefs,
  offset,
  className,
  style,
  show,
  children,
  ref,
}: PopoverContentProps) => {
  return (
    <EdgeIntersection
      id={id}
      className={combineStringsWithSpaces(
        dynatic`
          height: fit-content;
        `,
        className,
      )}
      style={style}
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
        onClick={show}
      >
        {children}
      </div>
    </EdgeIntersection>
  );
};
