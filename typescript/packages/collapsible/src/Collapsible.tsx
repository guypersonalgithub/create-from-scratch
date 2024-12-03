import {
  CSSProperties,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimationContainerUnmountWrapper,
  AnimationContainerWrapper,
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
  const [height, setHeight] = useState(0);
  const initiallyAnimatedOnFirstOpening = useRef(false);
  const previousAnimationFrameRef = useRef<Keyframe[]>([]);

  const animationFrames = useMemo(() => {
    if (!isOpen || height === 0 || initiallyAnimatedOnFirstOpening.current) {
      return;
    }

    const frames = [{ height: "0px" }, { height: `${height}px` }];
    previousAnimationFrameRef.current = frames;
    return frames;
  }, [isOpen, height]);

  const postChildChangeAnimationFrames = useMemo(() => {
    if (!isOpen || !initiallyAnimatedOnFirstOpening.current) {
      return;
    }

    const lastStoppedAnimation =
      previousAnimationFrameRef.current[previousAnimationFrameRef.current.length - 1];
    const frames = [lastStoppedAnimation, { height: `${height}px` }];
    previousAnimationFrameRef.current = frames;
    return frames;
  }, [height, isOpen]);

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
      <AnimationContainerUnmountWrapper changeMethod="gradual">
        {isOpen ? (
          <AnimationContainerWrapper
            key="collapsible"
            changeMethod="fullPhase"
            onMount={[{ height: "0px" }, { height: `${height}px` }]}
            animation={postChildChangeAnimationFrames || animationFrames}
            onAnimationEnd={() => {
              initiallyAnimatedOnFirstOpening.current = true;
            }}
            style={{ overflow: "hidden" }}
            disableAnimation={!initiallyAnimatedOnFirstOpening.current && height === 0}
          >
            <CollapsiableChildren
              key="collapsible-content"
              isOpen={isOpen}
              height={height}
              setHeight={setHeight}
            >
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
  isOpen: boolean;
  height: number;
  setHeight: (height: number) => void;
  children: ReactNode;
};

const CollapsiableChildren = ({
  isOpen,
  height,
  setHeight,
  children,
}: CollapsiableChildrenProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerHeight = useRef<number>(0);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { height } = ref.current.getBoundingClientRect();
    setHeight(height);
    containerHeight.current = height;

    return () => {
      setHeight(height);
    };
  }, []);

  useEffect(() => {
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isOpen]);

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
