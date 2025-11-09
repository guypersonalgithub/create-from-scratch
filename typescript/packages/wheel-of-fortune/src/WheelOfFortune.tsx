import { useImperativeHandle, useRef, type RefObject } from "react";
import { useAnimation } from "@packages/animation-container";
import { Button } from "@packages/button";
import { getClipPathTriangleVertices } from "@packages/element-utils";
import { calculateSameSizeSlices, getTriangleApexVertice, isPointInSlice } from "@packages/math";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

export type WheelOfFortuneRef = {
  spin: () => { cancelAnimation: () => void };
} | null;

const classNamesByCount: Record<number | string, string> = {
  1: dynatic`
    aspect-ratio: 1/1;
    width: var(--wheel-size);
  `,
  2: dynatic`
    aspect-ratio: 1 / calc(2 * tan(180deg / var(--items)));
    clip-path: none;
  `,
  // 3: dynatic`
  //   aspect-ratio: 1 / 2;
  //   clip-path: polygon(-35% -100%, 100% 50%, 0% 145%);
  // `,
  multi: dynatic`
    clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
    aspect-ratio: 1 / calc(2 * tan(180deg / var(--items)));
  `,
};

type WheelOfFortuneProps<T extends string> = {
  onAnimationEnd?: (args: { result?: T }) => void;
  wheelRef?: RefObject<WheelOfFortuneRef>;
  options: T[];
  animationDuration?: number;
  defaultRotationsPerSpin?: number;
  size?: string;
};

export const WheelOfFortune = <T extends string>({
  onAnimationEnd,
  wheelRef,
  options,
  animationDuration = 4000,
  defaultRotationsPerSpin = 5,
  size = "400px",
}: WheelOfFortuneProps<T>) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const optionsAmount = options.length;
  const { animate } = useAnimation();
  const previousDegree = useRef<number>(0);

  useImperativeHandle(wheelRef, () => ({
    spin: () => {
      const randomAdditionalDegrees = (Math.random() + defaultRotationsPerSpin) * 360;
      const newEndDegree = previousDegree.current - randomAdditionalDegrees;

      const { cancelAnimation } = animate({
        element: innerRef.current!,
        animation: [
          { transform: `rotate(${previousDegree.current}deg)` },
          { transform: `rotate(${newEndDegree}deg)` },
        ],
        animationOptions: {
          duration: animationDuration,
          easing: "cubic-bezier(0.440, -0.205, 0.000, 1.130)",
        },
        onAnimationEnd: () => {
          if (!onAnimationEnd) {
            return;
          }

          const getResult = () => {
            if (optionsAmount === 1) {
              return options[0];
            }

            const element = innerRef.current;
            const arrowElement = arrowRef.current;
            if (!element || !arrowElement) {
              return;
            }

            const vertices = getClipPathTriangleVertices({ element: arrowElement });
            if (!vertices) {
              return;
            }

            const apex = getTriangleApexVertice({ vertices });
            const rotation = 90 - 360 / optionsAmount / 2; // default value added to align the degrees of 1 with the actual rotated value of the wheel.
            const slices = calculateSameSizeSlices({
              slices: options,
              rotationOffset: 360 - (Math.abs(previousDegree.current) % 360) + rotation,
            });

            const rect = element.getBoundingClientRect();

            const center = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            };

            const radius = rect.width / 2;

            const point = slices.findIndex((slice) => {
              return isPointInSlice({
                point: apex,
                circleCenter: center,
                radius,
                startAngle: slice.start,
                endAngle: slice.end,
              });
            });

            return slices[point]?.slice as T;
          };

          const result = getResult();
          onAnimationEnd({ result });
        },
      });

      previousDegree.current = newEndDegree;

      return {
        cancelAnimation:
          cancelAnimation ??
          (() => {
            console.error("coinWrapper cannot be found");
          }),
      };
    },
  }));

  return (
    <div
      className={combineStringsWithSpaces(dynatic`
        --wheel-size: ${size};
        all: unset;
        clip-path: inset(0 0 0 0 round 50%);
        inset: 0;
        place-content: center start;
        aspect-ratio: 1 / 1;
        container-type: inline-size;
        display: grid;
        position: relative;
        height: var(--wheel-size);
        width: var(--wheel-size);
      `)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key !== " " && event.key !== "Enter") {
          return;
        }

        wheelRef?.current?.spin();
      }}
    >
      <div
        ref={innerRef}
        className={dynatic`
          all: unset;
          clip-path: inset(0 0 0 0 round 50%);
          display: grid;
          inset: 0;
          place-content: center start;
          position: absolute;
          rotate: 90deg;
        `}
      >
        {options.map((option, index) => {
          return (
            <div
              key={option}
              className={combineStringsWithSpaces(
                dynatic`
                    --items: ${optionsAmount};
                    --idx: ${index};
                    align-content: center;
                    background: hsl(calc(360deg / var(--items) * calc(var(--idx))), 100%, 75%);
                    display: grid;
                    font-size: 25px;
                    grid-area: 1 / -1;
                    padding-left: 5px;
                    rotate: calc(360deg / var(--items) * calc(var(--idx)));
                    transform-origin: center right;
                    user-select: none;
                    width: calc(var(--wheel-size) / 2);
                    box-sizing: border-box;
                  `,
                classNamesByCount[optionsAmount] ?? classNamesByCount["multi"],
              )}
            >
              {option}
            </div>
          );
        })}
      </div>
      <div
        ref={arrowRef}
        className={dynatic`
          height: 25px;
          width: 25px;
          background-color: crimson;
          clip-path: polygon(50% 100%, 100% 0, 0 0);
          content: "";
          position: absolute;
          place-self: start center;
          scale: 1.4;
        `}
      />
      <Button
        className={dynatic`
          z-index: 1000;
          position: absolute;
          left: calc(50% - calc(var(--wheel-size) / 16));
          top: calc(var(--wheel-size) / 2 - calc(var(--wheel-size) / 16));
          border: none;
          border-radius: 100%;
          width: calc(var(--wheel-size) / 8);
          height: calc(var(--wheel-size) / 8);
          text-align: center;
          cursor: pointer;
        `}
        onClick={() => wheelRef?.current?.spin()}
      >
        SPIN
      </Button>
    </div>
  );
};
