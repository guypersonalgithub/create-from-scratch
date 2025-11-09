import { AnimationContainerWrapper, useAnimation } from "@packages/animation-container";
import { type Anchor } from "./types";
import { useRef, type RefObject, useEffect, type CSSProperties } from "react";
import { registerAnchorRef } from "./registerRefs";
import { getLowestAnchorIndex } from "./utils";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type AnchorsProps = {
  anchors: Anchor[];
  visibleAnchors: string[];
  anchorClassName?: string;
  anchorStyle?: CSSProperties;
  visibleAnchorClassName?: string;
  visibleAnchorStyle?: CSSProperties;
  highlightBarContainerClassName?: string;
  highlightBarContainerStyle?: CSSProperties;
  highlightBarClassName?: string;
  highlightBarStyle?: CSSProperties;
  anchorsIdentifier: string;
  onClickCallback?: (anchor: { ref: HTMLElement }) => void;
};

export const Anchors = ({
  anchors,
  visibleAnchors,
  anchorClassName,
  visibleAnchorClassName,
  anchorStyle,
  visibleAnchorStyle,
  highlightBarContainerClassName,
  highlightBarContainerStyle,
  highlightBarClassName,
  highlightBarStyle,
  anchorsIdentifier,
  onClickCallback,
}: AnchorsProps) => {
  const anchorRefs = useRef<HTMLDivElement[]>([]);
  const selectedIndex = getLowestAnchorIndex({ visibleAnchors, anchors });

  useEffect(() => {
    anchorRefs.current = [];
  }, [anchorsIdentifier]);

  return (
    <div
      className={dynatic`
        display: flex;
        flex-direction: row-reverse;
        justify-content: start;
      `}
    >
      <div>
        {anchors.map((anchor) => {
          const { ref, content, id } = anchor;
          const isVisibleAnchor = visibleAnchors.includes(id);

          return (
            <div
              key={id}
              ref={(ref) => registerAnchorRef({ refs: anchorRefs, ref })}
              className={combineStringsWithSpaces(
                dynatic`
                  cursor: pointer;
                  font-weight: bold;
                `,
                anchorClassName,
                isVisibleAnchor && visibleAnchorClassName,
              )}
              onClick={() => {
                ref.scrollIntoView({ behavior: "smooth", block: "start" });
                onClickCallback?.({ ref });
              }}
              style={{
                // fontWeight: isVisibleAnchor ? "bolder" : "normal",
                ...anchorStyle,
                ...(isVisibleAnchor ? visibleAnchorStyle : {}),
              }}
            >
              {content}
            </div>
          );
        })}
      </div>
      <AnimationContainerWrapper onMount={[{ opacity: 0 }, { opacity: 1 }]}>
        {selectedIndex !== -1 ? (
          <HighlightBar
            key="highlightBar"
            refs={anchorRefs}
            selectedIndex={selectedIndex}
            highlightBarContainerClassName={highlightBarContainerClassName}
            highlightBarContainerStyle={highlightBarContainerStyle}
            highlightBarClassName={highlightBarClassName}
            highlightBarStyle={highlightBarStyle}
          />
        ) : (
          <></>
        )}
      </AnimationContainerWrapper>
    </div>
  );
};

type HighlightBarProps = Pick<
  AnchorsProps,
  | "highlightBarContainerClassName"
  | "highlightBarContainerStyle"
  | "highlightBarClassName"
  | "highlightBarStyle"
> & {
  refs: RefObject<(HTMLDivElement | null)[]>;
  selectedIndex: number;
};

type TabProperties = {
  height: number;
  top: number;
};

const HighlightBar = ({
  refs,
  selectedIndex,
  highlightBarContainerClassName,
  highlightBarContainerStyle,
  highlightBarClassName,
  highlightBarStyle,
}: HighlightBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const containerTop = useRef<number>(0);
  const lastTab = useRef<TabProperties>({
    height: 0,
    top: 0,
  });
  const { animate } = useAnimation();

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const setContainerTop = () => {
      if (!containerRef.current) {
        return;
      }

      const { top } = containerRef.current.getBoundingClientRect();
      containerTop.current = top;
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          setContainerTop();
        }
      }
    });

    observer.observe(containerRef.current);

    setContainerTop();

    return () => {
      if (!containerRef.current) {
        return;
      }

      observer.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!highlightRef.current) {
      return;
    }

    const getRefProperties = (ref: HTMLDivElement | null) => {
      const { height, top } = ref?.getBoundingClientRect() ?? {
        height: 0,
        top: 0,
      };

      return {
        height,
        top: top - containerTop.current,
      };
    };

    const newTabProperties = getRefProperties(refs.current[selectedIndex]);

    const animation = [
      {
        height: `${lastTab.current.height}px`,
        transform: `translateY(${lastTab.current.top}px)`,
      },
      {
        height: `${newTabProperties.height}px`,
        transform: `translateY(${newTabProperties.top}px)`,
      },
    ];
    const animationOptions = { duration: 300, easing: "ease-out" };

    const onAnimationEnd = () => {
      lastTab.current = newTabProperties;
    };

    const {} = animate({
      element: highlightRef.current,
      animation,
      animationOptions,
      onAnimationEnd,
    });

    return () => {
      lastTab.current = newTabProperties;
    };
  }, [selectedIndex]);

  return (
    <div
      ref={containerRef}
      className={dynatic`
        position: relative;
      `}
    >
      <div
        ref={highlightRef}
        className={combineStringsWithSpaces(
          dynatic`
            position: absolute;
            right: 5px;
          `,
          highlightBarContainerClassName,
        )}
        style={highlightBarContainerStyle}
      >
        <div
          key="bar"
          className={combineStringsWithSpaces(
            dynatic`
              width: 5px;
              height: inherit;
              background-color: #5662F6;
              border-radius: 8px;
            `,
            highlightBarClassName,
          )}
          style={highlightBarStyle}
        />
      </div>
    </div>
  );
};
