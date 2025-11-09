import { type CSSProperties, type ReactNode } from "react";
import { type CustomEdges, type EdgeWrapperRefs } from "./types";
import { calculateBaseWithOffset } from "./utils";
import { capitalizeFirstChar, combineStringsWithSpaces } from "@packages/string-utils";
import { type OmitByPattern } from "@packages/utils";
import { dynatic } from "@packages/dynatic-css";

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
  edgeIntersectionClassName?: string;
  edgeIntersectionStyle?: CSSProperties;
  childrenWrapperClassName?: string;
  childrenWrapperStyle?: CSSProperties;
};

const sideIntersections: Record<
  keyof OmitByPattern<EdgeWrapperRefs, CustomEdges>,
  {
    className: string;
    position: {
      left: number | string;
      top: number | string;
    };
  }
> = {
  topLeft: {
    className: dynatic`
      left: 0;
      top: 0;
    `,
    position: {
      left: 0,
      top: 0,
    },
  },
  left: {
    className: dynatic`
      left: 0;
      top: 50%;
    `,
    position: {
      left: 0,
      top: "50%",
    },
  },
  bottomLeft: {
    className: dynatic`
      left: 0;
      top: 100%;
    `,
    position: {
      left: 0,
      top: "100%",
    },
  },
  top: {
    className: dynatic`
      left: 50%;
      top: 0;
    `,
    position: {
      left: "50%",
      top: 0,
    },
  },
  bottom: {
    className: dynatic`
      left: 50%;
      top: 100%;
    `,
    position: {
      left: "50%",
      top: "100%",
    },
  },
  topRight: {
    className: dynatic`
      left: 100%;
      top: 0;
    `,
    position: {
      left: "100%",
      top: 0,
    },
  },
  right: {
    className: dynatic`
      left: 100%;
      top: 50%;
    `,
    position: {
      left: "100%",
      top: "50%",
    },
  },
  bottomRight: {
    className: dynatic`
      left: 100%;
      top: 100%;
    `,
    position: {
      left: "100%",
      top: "100%",
    },
  },
};

const intersections: {
  className: string;
  left: number | string;
  top: number | string;
  position: keyof EdgeWrapperRefs;
}[] = Object.entries(sideIntersections).map(([key, { className, position }]) => {
  return {
    className,
    ...position,
    position: key as keyof EdgeWrapperRefs,
  };
});

export const EdgeIntersection = ({
  id,
  className,
  style = {},
  children,
  intersectionRefs,
  offset,
  edgeIntersectionClassName,
  edgeIntersectionStyle,
  childrenWrapperClassName,
  childrenWrapperStyle,
}: EdgeIntersectionProps) => {
  const edgeIntersections = [
    ...(offset
      ? intersections.map((intersection) => {
          const { left, top, position } = intersection;

          return {
            className: dynatic`
              left: ${
                offset.x
                  ? calculateBaseWithOffset({
                      base: left,
                      offset: offset.x,
                    })
                  : left
              };
              top: ${
                offset.y
                  ? calculateBaseWithOffset({
                      base: top,
                      offset: offset.y,
                    })
                  : top
              };
            `,
            position: `custom${capitalizeFirstChar({ str: position })}` as keyof EdgeWrapperRefs,
          };
        })
      : intersections.map((intersection) => {
          const { className, position } = intersection;

          return {
            className,
            position: `custom${capitalizeFirstChar({ str: position })}` as keyof EdgeWrapperRefs,
          };
        })),
  ];

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          width: fit-content;
          height: fit-content;
          display: grid;
        `,
        className,
      )}
      style={style}
    >
      <div
        className={combineStringsWithSpaces(
          dynatic`
            grid-area: 1/1;
          `,
          childrenWrapperClassName,
        )}
        style={childrenWrapperStyle}
      >
        {children}
      </div>
      <div
        className={dynatic`
          grid-area: 1/1;
          position: relative;
          pointer-events: none;
        `}
      >
        {edgeIntersections.map((intersection) => {
          const { className, position } = intersection;
          const ref = intersectionRefs[position];

          return (
            <div
              key={position}
              id={`${id}-${position}`}
              ref={ref}
              className={combineStringsWithSpaces(
                dynatic`
                  position: absolute;
                `,
                className,
                edgeIntersectionClassName,
              )}
              style={edgeIntersectionStyle}
            />
          );
        })}
      </div>
    </div>
  );
};
