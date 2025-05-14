import { Dispatch, RefObject, SetStateAction } from "react";
import { AnimationlessCarouselProps } from "./types";
import { ArrowLeft, ArrowRight } from "@packages/icons";

type AnimationlessContentProps = Omit<
  AnimationlessCarouselProps,
  "automaticTransition" | "stopTransitionWhenOutOfView" | "transitionDelay"
> & {
  contentRef?: RefObject<HTMLDivElement | null>;
  stage: number;
  setStage: Dispatch<SetStateAction<number>>;
};

export const AnimationlessContent = ({
  contentRef,
  style,
  items,
  displayArrows,
  displayIndicators,
  stage,
  setStage,
}: AnimationlessContentProps) => {
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
          }}
          onClick={() =>
            setStage((prev) => {
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
      {items[stage] ?? null}
      {displayArrows ? (
        <div
          style={{
            cursor: "pointer",
            position: "absolute",
            height: "100%",
            right: 0,
            width: "20px",
            top: "50%",
          }}
          onClick={() =>
            setStage((prev) => {
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
        style={{ position: "absolute", display: "flex", gap: "6px", flexWrap: "wrap", bottom: 50 }}
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
                  onClick={() => setStage(index)}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};
