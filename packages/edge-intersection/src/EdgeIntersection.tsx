import { CSSProperties, ReactNode } from "react";
import { CustomEdges, EdgeWrapperRefs } from "./types";
import { calculateBaseWithOffset } from "./utils";
import { capitalizeFirstChar, type OmitByPattern } from "@packages/utils";

type EdgeIntersectionProps = {
  id: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  intersectionRefs: EdgeWrapperRefs;
  offset?: {
    x?: number;
    y?: number;
  };
};

const sideIntersections: Record<
  keyof OmitByPattern<EdgeWrapperRefs, CustomEdges>,
  {
    left: number | string;
    top: number | string;
  }
> = {
  topLeft: {
    left: 0,
    top: 0,
  },
  left: {
    left: 0,
    top: "50%",
  },
  bottomLeft: {
    left: 0,
    top: "100%",
  },
  top: {
    left: "50%",
    top: 0,
  },
  bottom: {
    left: "50%",
    top: "100%",
  },
  topRight: {
    left: "100%",
    top: 0,
  },
  right: {
    left: "100%",
    top: "50%",
  },
  bottomRight: {
    left: "100%",
    top: "100%",
  },
};

const intersections: {
  left: number | string;
  top: number | string;
  position: keyof EdgeWrapperRefs;
}[] = Object.entries(sideIntersections).map(([key, value]) => {
  return {
    ...value,
    position: key as keyof EdgeWrapperRefs,
  };
});

export const EdgeIntersection = ({
  id,
  className,
  style,
  children,
  intersectionRefs,
  offset,
}: EdgeIntersectionProps) => {
  const edgeIntersections: typeof intersections = [
    ...intersections,
    ...(offset
      ? intersections.map((intersection) => {
          const { left, top, position } = intersection;

          return {
            left: calculateBaseWithOffset({
              base: left,
              offset: offset?.x,
            }),
            top: calculateBaseWithOffset({
              base: top,
              offset: offset?.y,
            }),
            position: `custom${capitalizeFirstChar({ str: position })}` as keyof EdgeWrapperRefs,
          };
        })
      : []),
  ];

  return (
    <div
      className={className}
      style={{
        width: "fit-content",
        height: "fit-content",
        ...style,
        display: "grid",
      }}
    >
      <div style={{ gridArea: "1/1", width: "fit-content", height: "fit-content", ...style }}>
        {children}
      </div>
      <div style={{ gridArea: "1/1", position: "relative", pointerEvents: "none" }}>
        {edgeIntersections.map((intersection) => {
          const { top, left, position } = intersection;
          const ref = intersectionRefs[position];

          return (
            <div
              key={position}
              id={`${id}-${position}`}
              ref={ref}
              style={{
                position: "absolute",
                // border: position.includes("custom") ? "1px solid blue" : "1px solid green",
                top,
                left,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
