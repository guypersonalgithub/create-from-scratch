import { useImperativeHandle, useRef, type ReactNode, type RefObject } from "react";
import { useAnimation } from "@packages/animation-container";

export type RotateRef = {
  rotate: () => { cancelAnimation: () => void };
} | null;

type Rotate = {
  start: string;
  end: string;
};

type RotateWrapperProps = {
  rotateRef: RefObject<RotateRef>;
  rotateX?: Rotate;
  rotateY?: Rotate;
  rotateZ?: Rotate;
  children: ReactNode;
  onAnimationEnd?: () => void;
  animationDuration?: number;
  infiniteRotation?: boolean;
};

export const RotateWrapper = ({
  rotateRef,
  rotateX,
  rotateY,
  rotateZ,
  children,
  onAnimationEnd,
  animationDuration = 1000,
  infiniteRotation,
}: RotateWrapperProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const { animate } = useAnimation();

  useImperativeHandle(rotateRef, () => ({
    rotate: () => {
      const start = [
        rotateX ? `rotateX(${rotateX.start})` : "",
        rotateY ? `rotateY(${rotateY.start})` : "",
        rotateZ ? `rotateZ(${rotateZ.start})` : "",
      ]
        .filter(Boolean)
        .join(" ");
      const end = [
        rotateX ? `rotateX(${rotateX.end})` : "",
        rotateY ? `rotateY(${rotateY.end})` : "",
        rotateZ ? `rotateZ(${rotateZ.end})` : "",
      ]
        .filter(Boolean)
        .join(" ");

      const { cancelAnimation } = animate({
        element: innerRef.current!,
        animation: [
          {
            transform: start,
          },
          {
            transform: end,
          },
        ],
        animationOptions: {
          duration: animationDuration,
          iterations: infiniteRotation ? Infinity : 1,
          easing: "linear",
        },
        onAnimationEnd: () => onAnimationEnd?.(),
      });

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
    <div ref={innerRef} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
};
