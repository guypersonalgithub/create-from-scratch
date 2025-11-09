import { useImperativeHandle, useRef, type RefObject } from "react";
import { useAnimation } from "@packages/animation-container";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

const dotClassName = dynatic`
  position: absolute;
  width: 20%;
  height: 20%;
  border-radius: 100%;
  background-color: #f25f5c;
  box-shadow: inset 2px 2px #d90429;
`;

const middleDotClassName = dynatic`
  transform: translate(calc(var(--diceSize) * 4 / 10), calc(var(--diceSize) * 4 / 10));
`;

const topLeftDotClassName = dynatic`
  transform: translate(calc(var(--diceSize) / 10), calc(var(--diceSize) / 10));
`;

const topRightDotClassName = dynatic`
  transform: translate(calc(var(--diceSize) * 7 / 10), calc(var(--diceSize) / 10));
`;

const bottomLeftDotClassName = dynatic`
  transform: translate(calc(var(--diceSize) / 10), calc(var(--diceSize) * 7 / 10));
`;

const bottomRightDotClassName = dynatic`
  transform: translate(calc(var(--diceSize) * 7 / 10), calc(var(--diceSize) * 7 / 10));
`;

const middleLeftDotClassName = dynatic`
  transform: translate(calc(var(--diceSize) / 10), calc(var(--diceSize) * 4 / 10));
`;

const middleRightDotClassName = dynatic`
  transform: translate(calc(var(--diceSize) * 7 / 10), calc(var(--diceSize) * 4 / 10));
`;

const sideClassName = dynatic`
  position: absolute;
  background-color: #ffffff;
  border-radius: 5px;
  width: inherit;
  height: inherit;
  border: 1px solid #e5e5e5;
`;

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

  const middleDotClassNames = combineStringsWithSpaces(dotClassName, middleDotClassName);
  const topLeftDotClassNames = combineStringsWithSpaces(dotClassName, topLeftDotClassName);
  const topRightDotClassNames = combineStringsWithSpaces(dotClassName, topRightDotClassName);
  const bottomLeftDotClassNames = combineStringsWithSpaces(dotClassName, bottomLeftDotClassName);
  const bottomRightDotClassNames = combineStringsWithSpaces(dotClassName, bottomRightDotClassName);

  return (
    <div
      className={dynatic`
        --diceSize: ${size}px;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 1s;
        height: var(--diceSize);
        width: var(--diceSize);
      `}
      ref={innerRef}
    >
      <div
        className={combineStringsWithSpaces(
          dynatic`
            transform: translateZ(calc(var(--diceSize) / 2));
          `,
          sideClassName,
        )}
      >
        <div className={middleDotClassNames} />
      </div>
      <div
        className={combineStringsWithSpaces(
          dynatic`
            transform: rotateY(-180deg) translateZ(calc(var(--diceSize) / 2));
          `,
          sideClassName,
        )}
      >
        <div className={topLeftDotClassNames} />
        <div className={bottomRightDotClassNames} />
      </div>
      <div
        className={combineStringsWithSpaces(
          dynatic`
            transform: rotateY(-90deg) translateZ(calc(var(--diceSize) / 2));
          `,
          sideClassName,
        )}
      >
        <div className={topLeftDotClassNames} />
        <div className={middleDotClassNames} />
        <div className={bottomRightDotClassNames} />
      </div>
      <div
        className={combineStringsWithSpaces(
          dynatic`
            transform: rotateX(90deg) translateZ(calc(var(--diceSize) / 2));
          `,
          sideClassName,
        )}
      >
        <div className={topLeftDotClassNames} />
        <div className={bottomLeftDotClassNames} />
        <div className={topRightDotClassNames} />
        <div className={bottomRightDotClassNames} />
      </div>
      <div
        className={combineStringsWithSpaces(
          dynatic`
            transform: rotateX(-90deg) translateZ(calc(var(--diceSize) / 2));
          `,
          sideClassName,
        )}
      >
        <div className={topLeftDotClassNames} />
        <div className={bottomLeftDotClassNames} />
        <div className={topRightDotClassNames} />
        <div className={bottomRightDotClassNames} />
        <div className={middleDotClassNames} />
      </div>
      <div
        className={combineStringsWithSpaces(
          dynatic`
            transform: rotateY(90deg) translateZ(calc(var(--diceSize) / 2));
          `,
          sideClassName,
        )}
      >
        <div className={topLeftDotClassNames} />
        <div className={combineStringsWithSpaces(dotClassName, middleLeftDotClassName)} />
        <div className={bottomLeftDotClassNames} />
        <div className={topRightDotClassNames} />
        <div className={combineStringsWithSpaces(dotClassName, middleRightDotClassName)} />
        <div className={bottomRightDotClassNames} />
      </div>
    </div>
  );
};
