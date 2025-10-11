import { useImperativeHandle, useRef, type RefObject, type CSSProperties } from "react";
import { useAnimation } from "@packages/animation-container";
import "./sixSidedDiceRoll.css";

type Results = 1 | 2 | 3 | 4 | 5 | 6;

export type SixSidedDiceRollRef = {
  roll: () => { cancelAnimation: () => void };
} | null;

type SixSidedDiceRollProps = {
  onAnimationEnd?: (args: { result: Results }) => void;
  diceRef?: RefObject<SixSidedDiceRollRef>;
  size?: number;
  defaultRotationsPerRoll?: number;
  animationDuration?: number;
};

const rollValues: Record<number, { x?: number; y?: number; z?: number }> = {
  1: { x: 360, z: -360 },
  2: { x: 180, z: -180 },
  3: { y: 90, z: 360 },
  4: { x: -90, z: -360 },
  5: { x: 90, z: -360 },
  6: { y: -90, z: -360 },
};

export const SixSidedDiceRoll = ({
  onAnimationEnd,
  diceRef,
  size = 100,
  defaultRotationsPerRoll = 3,
  animationDuration = 2000,
}: SixSidedDiceRollProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const { animate } = useAnimation();
  const currentAmountOfRolls = useRef<number>(defaultRotationsPerRoll);
  const lastRoll = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  useImperativeHandle(diceRef, () => ({
    roll: () => {
      const result = Math.floor(Math.random() * 6 + 1) as Results;
      const { x = 0, y = 0, z = 0 } = rollValues[result];
      const roll = (Math.random() + currentAmountOfRolls.current) * 360;

      const calculateDifference = (value: number) => {
        if (value === 0) {
          return 0;
        }

        const alignedRoll = value > 0 ? roll : -roll;
        const difference = 360 - (alignedRoll % 360) + value;
        return alignedRoll + difference;
      };

      const newX = calculateDifference(x);
      const newY = calculateDifference(y);
      const newZ = calculateDifference(z);

      const { cancelAnimation } = animate({
        element: innerRef.current!,
        animation: [
          {
            transform: `rotateX(${lastRoll.current.x}deg) rotateY(${lastRoll.current.y}deg) rotateZ(${lastRoll.current.z}deg)`,
          },
          {
            transform: `rotateX(${newX}deg) rotateY(${newY}deg) rotateZ(${newZ}deg)`,
          },
        ],
        animationOptions: {
          duration: animationDuration,
          easing: "cubic-bezier(0.440, -0.205, 0.000, 1.130)",
        },
        onAnimationEnd: () => {
          if (!onAnimationEnd) {
            return;
          }

          onAnimationEnd({ result });
        },
      });

      lastRoll.current = {
        x: newX,
        y: newY,
        z: newZ,
      };
      currentAmountOfRolls.current += defaultRotationsPerRoll;

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
    <div className="dice" style={{ "--diceSize": `${size}px` } as CSSProperties} ref={innerRef}>
      <div className="side firstSide">
        <div className="dot one-1" />
      </div>
      <div className="side secondSide">
        <div className="dot two-1" />
        <div className="dot two-2" />
      </div>
      <div className="side thirdSide">
        <div className="dot three-1" />
        <div className="dot three-2" />
        <div className="dot three-3" />
      </div>
      <div className="side forthSide">
        <div className="dot four-1" />
        <div className="dot four-2" />
        <div className="dot four-3" />
        <div className="dot four-4" />
      </div>
      <div className="side fifthSide">
        <div className="dot five-1" />
        <div className="dot five-2" />
        <div className="dot five-3" />
        <div className="dot five-4" />
        <div className="dot five-5" />
      </div>
      <div className="side sixthSide">
        <div className="dot six-1" />
        <div className="dot six-2" />
        <div className="dot six-3" />
        <div className="dot six-4" />
        <div className="dot six-5" />
        <div className="dot six-6" />
      </div>
    </div>
  );
};
