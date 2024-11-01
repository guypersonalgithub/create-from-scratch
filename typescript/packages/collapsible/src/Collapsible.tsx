import { ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AnimationContainerUnmountWrapper,
  AnimationContainerWrapper,
} from "@packages/animation-container";

type CollapsibleProps = {
  title: string;
  isOpenInitially?: boolean;
  // maximumContentHeight: number;
  children: ReactNode;
};

export const Collapsible = ({ title, isOpenInitially = false, children }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);
  const [height, setHeight] = useState(0);
  const initiallyAnimatedOnFirstOpening = useRef(false);

  const animationFrames = useMemo(() => {
    if (!isOpen || height === 0 || initiallyAnimatedOnFirstOpening.current) {
      return;
    }

    return [{ height: "0px" }, { height: `${height}px` }];
  }, [isOpen, height]);

  return (
    <div>
      <div
        style={{
          cursor: "pointer",
          width: "fit-content",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
          }}
        >
          {title}
          <div
            style={{
              width: "0px",
              height: "0px",
              borderBottom: "6px solid transparent",
              borderTop: "6px solid transparent",
              borderLeft: "6px solid black",
              transition: "transform 0.3s ease",
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>
      <AnimationContainerUnmountWrapper changeMethod="gradual">
        {isOpen ? (
          <AnimationContainerWrapper
            key="collapsible"
            changeMethod="fullPhase"
            onMount={[{ height: "0px" }, { height: `${height}px` }]}
            animation={animationFrames}
            onAnimationEnd={() => {
              initiallyAnimatedOnFirstOpening.current = true;
            }}
            style={{ overflow: "hidden" }}
            disableAnimation={height === 0}
          >
            <CollapsiableChildren height={height} setHeight={setHeight}>
              {children}
            </CollapsiableChildren>
          </AnimationContainerWrapper>
        ) : (
          <></>
        )}
      </AnimationContainerUnmountWrapper>
    </div>
  );
};

type CollapsiableChildrenProps = {
  height: number;
  setHeight: (height: number) => void;
  children: ReactNode;
};

const CollapsiableChildren = ({ height, setHeight, children }: CollapsiableChildrenProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const { height } = ref.current.getBoundingClientRect();
    setHeight(height);
  }, []);

  return (
    <div
      ref={ref}
      style={
        height === 0
          ? {
              overflow: "hidden",
              opacity: 0,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};
