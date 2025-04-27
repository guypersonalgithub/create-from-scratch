import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import {
  AnimationContainerUnmountWrapper,
  AnimationContainerWrapper,
  useAnimation,
} from "@packages/animation-container";

type CollapsibleProps = {
  title: string;
  isOpenInitially?: boolean;
  containerStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  children: ReactNode;
};

export const Collapsible = ({
  title,
  isOpenInitially = false,
  containerStyle = {},
  titleStyle = {},
  children,
}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  return (
    <div style={{ width: "fit-content", ...containerStyle }}>
      <div
        style={{
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
            ...titleStyle,
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
      <CollapsibleContent isOpen={isOpen}>{children}</CollapsibleContent>
    </div>
  );
};

type CollapsibleContentProps = {
  isOpen: boolean;
  children: ReactNode;
};

const CollapsibleContent = ({ isOpen, children }: CollapsibleContentProps) => {
  const [height, setHeight] = useState(0);
  const { animate } = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const previousAnimationFrameRef = useRef<Keyframe[]>([]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const lastStoppedAnimation =
      previousAnimationFrameRef.current[previousAnimationFrameRef.current.length - 1];
    const newHeight = `${height}px`;

    if (lastStoppedAnimation?.height === newHeight) {
      return;
    }

    const element = ref.current;
    const frames = [lastStoppedAnimation ?? { height: "0px" }, { height: newHeight }];

    const { cancelAnimation } = animate({
      element,
      animation: frames,
      onAnimationEnd: () => {
        previousAnimationFrameRef.current = frames;
      },
    });

    return () => {
      cancelAnimation?.();
    };
  }, [height]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    previousAnimationFrameRef.current = [];
  }, [isOpen]);

  return (
    <AnimationContainerUnmountWrapper changeMethod="gradual">
      {isOpen ? (
        <AnimationContainerWrapper
          key="collapsible"
          externalRef={ref}
          changeMethod="fullPhase"
          onMount={[{ height: "0px" }, { height: `${height}px` }]}
          style={{ overflow: "hidden" }}
        >
          <CollapsiableChildren key="collapsible-content" height={height} setHeight={setHeight}>
            {children}
          </CollapsiableChildren>
        </AnimationContainerWrapper>
      ) : (
        <></>
      )}
    </AnimationContainerUnmountWrapper>
  );
};

type CollapsiableChildrenProps = {
  height: number;
  setHeight: (height: number) => void;
  children: ReactNode;
};

const CollapsiableChildren = ({ height, setHeight, children }: CollapsiableChildrenProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerHeight = useRef<number>(0);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { height } = ref.current.getBoundingClientRect();
    setHeight(height);
    containerHeight.current = height;
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      let totalHeight: number = 0;
      for (let entry of entries) {
        if (entry.target === ref.current) {
          const newHeight = entry.contentRect.height;
          totalHeight += newHeight;
        }
      }

      if (totalHeight > containerHeight.current) {
        setHeight(totalHeight);
      }
    });

    observer.observe(ref.current);

    return () => {
      if (!ref.current) {
        return;
      }

      observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      style={
        height === 0
          ? {
              overflow: "hidden",
              opacity: 0,
            }
          : undefined
      }
    >
      <div ref={ref}>{children}</div>
    </div>
  );
};
