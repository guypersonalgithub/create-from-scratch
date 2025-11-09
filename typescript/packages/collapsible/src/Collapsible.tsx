import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import {
  AnimationContainerUnmountWrapper,
  AnimationContainerWrapper,
  useAnimation,
} from "@packages/animation-container";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type CollapsibleProps = {
  title: string;
  isOpenInitially?: boolean;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  titleClassName?: string;
  titleStyle?: CSSProperties;
  children: ReactNode;
};

export const Collapsible = ({
  title,
  isOpenInitially = false,
  containerClassName,
  containerStyle,
  titleClassName,
  titleStyle,
  children,
}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          width: fit-content;
        `,
        containerClassName,
      )}
      style={containerStyle}
    >
      <div
        className={dynatic`
          cursor: pointer;
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={combineStringsWithSpaces(
            dynatic`
              display: flex;
              align-items: center;
              gap: 10px;
              font-weight: bold;
            `,
            titleClassName,
          )}
          style={titleStyle}
        >
          {title}
          <div
            className={combineStringsWithSpaces(
              dynatic`
                width: 0;
                height: 0;
                border-bottom: 6px solid transparent;
                border-top: 6px solid transparent;
                border-left: 6px solid black;
                transition: transform 0.3s ease;
              `,
              isOpen
                ? dynatic`
                    transform: rotate(90deg);
                  `
                : dynatic`
                    transform: rotate(0deg);
                  `,
            )}
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
          className={dynatic`
            overflow: hidden;  
          `}
          disableMountAnimationOnInit={false}
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
      for (const entry of entries) {
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
      className={
        height === 0
          ? dynatic`
              overflow: hidden;
              opacity: 0;
            `
          : undefined
      }
    >
      <div ref={ref}>{children}</div>
    </div>
  );
};
