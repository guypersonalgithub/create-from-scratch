import { type Dispatch, type ReactNode, type RefObject, type SetStateAction } from "react";
import { type CarouselProps } from "./types";
import { ArrowLeft, ArrowRight } from "@packages/icons";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type CarouselContentProps = Omit<
  CarouselProps,
  "automaticTransition" | "stopTransitionWhenOutOfView" | "transitionDelay"
> & {
  contentRef?: RefObject<HTMLDivElement | null>;
  stage: number;
  onLeftArrowClick: Dispatch<SetStateAction<number>>;
  onRightArrowClick: Dispatch<SetStateAction<number>>;
  onIndicatorClick: (stage: number) => void;
  children: ReactNode;
};

export const CarouselContent = ({
  contentRef,
  className,
  style,
  items,
  displayArrows,
  displayIndicators,
  stage,
  onLeftArrowClick,
  onRightArrowClick,
  onIndicatorClick,
  children,
}: CarouselContentProps) => {
  return (
    <div
      ref={contentRef}
      className={combineStringsWithSpaces(
        dynatic`
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        `,
        className,
      )}
      style={style}
    >
      {displayArrows ? (
        <div
          className={dynatic`
            cursor: pointer;
            position: absolute;
            height: 100%;
            left: 0;
            width: 20px;
            top: 50%;
            z-index: 10;
          `}
          onClick={() =>
            onLeftArrowClick((prev) => {
              if (prev === 0) {
                return items.length - 1;
              }

              return prev - 1;
            })
          }
        >
          <ArrowLeft
            className={dynatic`
              width: 30px;
              height: 30px;
            `}
          />
        </div>
      ) : null}
      {children}
      {displayArrows ? (
        <div
          className={dynatic`
            cursor: pointer;
            position: absolute;
            height: 100%;
            right: 10px;
            width: 20px;
            top: 50%;
            z-index: 10;
          `}
          onClick={() =>
            onRightArrowClick((prev) => {
              if (prev === items.length - 1) {
                return 0;
              }

              return prev + 1;
            })
          }
        >
          <ArrowRight
            className={dynatic`
              width: 30px;
              height: 30px;
            `}
          />
        </div>
      ) : null}
      <div
        className={dynatic`
          position: absolute;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          bottom: 50px;
          z-index: 10;
        `}
      >
        {displayIndicators
          ? items.map((_, index) => {
              return (
                <div
                  key={index}
                  className={combineStringsWithSpaces(
                    dynatic`
                      border: 1px solid grey;
                      width: 10px;
                      height: 10px;
                      border-radius: 100%;
                      cursor: pointer;
                    `,
                    stage === index
                      ? dynatic`
                          background-color: white;
                        `
                      : dynatic`
                          background-color: grey;
                        `,
                  )}
                  onClick={() => onIndicatorClick(index)}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};
