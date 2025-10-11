import { useImperativeHandle, useRef, type RefObject, type CSSProperties } from "react";
import { useAnimation } from "@packages/animation-container";
import { Button } from "@packages/button";
import "./style.css";
import { getClipPathTriangleVertices } from "@packages/element-utils";
import { calculateSameSizeSlices, getTriangleApexVertice, isPointInSlice } from "@packages/math";

export type WheelOfFortuneRef = {
  spin: () => { cancelAnimation: () => void };
} | null;

const classNamesByCount: Record<number, string> = {
  1: "single",
  2: "two",
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
      className="wheel-of-fortune"
      style={{ "--wheel-size": size } as CSSProperties}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key !== " " && event.key !== "Enter") {
          return;
        }

        wheelRef?.current?.spin();
      }}
    >
      <div ref={innerRef} className="wheel-of-fortune-wrapper">
        {options.map((option, index) => {
          return (
            <div
              key={option}
              className={`wheel-of-fortune-option wheel-of-fortune-option-${classNamesByCount[optionsAmount] ?? "multi"}`}
              style={
                {
                  "--items": optionsAmount,
                  "--idx": index,
                } as CSSProperties
              }
            >
              {option}
            </div>
          );
        })}
      </div>
      <div ref={arrowRef} className="wheel-of-fortune-arrow" />
      <Button className="wheel-of-fortune-button" onClick={() => wheelRef?.current?.spin()}>
        SPIN
      </Button>
    </div>
  );
};
