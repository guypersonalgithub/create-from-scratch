import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { CarouselProps } from "./types";
import { ArrowLeft, ArrowRight } from "@packages/icons";

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
      style={{
        ...style,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {displayArrows ? (
        <div
          style={{
            cursor: "pointer",
            position: "absolute",
            height: "100%",
            left: 0,
            width: "20px",
            top: "50%",
            zIndex: 10,
          }}
          onClick={() =>
            onLeftArrowClick((prev) => {
              if (prev === 0) {
                return items.length - 1;
              }

              return prev - 1;
            })
          }
        >
          <ArrowLeft size={30} />
        </div>
      ) : null}
      {children}
      {displayArrows ? (
        <div
          style={{
            cursor: "pointer",
            position: "absolute",
            height: "100%",
            right: "10px",
            width: "20px",
            top: "50%",
            zIndex: 10,
          }}
          onClick={() =>
            onRightArrowClick((prev) => {
              if (prev === items.length - 1) {
                return 0;
              }

              return prev + 1;
            })
          }
        >
          <ArrowRight size={30} />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          bottom: 50,
          zIndex: 10,
        }}
      >
        {displayIndicators
          ? items.map((_, index) => {
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: stage === index ? "white" : "grey",
                    border: "1px solid grey",
                    width: "10px",
                    height: "10px",
                    borderRadius: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => onIndicatorClick(index)}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};
