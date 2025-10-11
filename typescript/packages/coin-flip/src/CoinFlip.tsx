import { useImperativeHandle, useRef, type RefObject } from "react";
import "./style.css";
import { useAnimation } from "@packages/animation-container";

export type CoinFlipRef = {
  flip: () => { cancelAnimation: () => void };
} | null;

type CoinFlipProps = {
  onAnimationEnd?: (args: { result: "head" | "tails" }) => void;
  coinRef?: RefObject<CoinFlipRef>;
  amountOfFlips?: number;
  animationDuration?: number;
};

export const CoinFlip = ({
  onAnimationEnd,
  coinRef,
  amountOfFlips = 10,
  animationDuration = 1400,
}: CoinFlipProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const { animate } = useAnimation();

  useImperativeHandle(coinRef, () => ({
    flip: () => {
      const displayHead = Math.floor(Math.random() * 2) === 0;
      const baseRotation = amountOfFlips * 360;
      const offset = displayHead ? 0 : 180; // 0 = heads, 180 = tails

      const { cancelAnimation } = animate({
        element: innerRef.current!,
        animation: [
          { transform: `rotateX(${offset}deg) scale3d(1, 1, 1)`, offset: 0 },
          {
            transform: `rotateX(${offset + baseRotation / 2}deg) scale3d(2.2, 2.2, 2.2)`,
            offset: 0.5,
          },
          { transform: `rotateX(${offset + baseRotation}deg) scale3d(1, 1, 1)`, offset: 1 },
        ],
        animationOptions: { duration: animationDuration },
        onAnimationEnd: () => onAnimationEnd?.({ result: displayHead ? "head" : "tails" }),
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
    <div className="coinWrapper">
      <div className="coin" ref={innerRef}>
        <div className="coinFront">HEADS</div>
        <div className="coinBack">TAILS</div>
      </div>
    </div>
  );
};
