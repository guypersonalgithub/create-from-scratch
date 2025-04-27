import { AnimationContainerWrapper, useAnimation } from "@packages/animation-container";
import { Anchor } from "./types";
import { useRef, RefObject, useEffect } from "react";
import { registerAnchorRef } from "./registerRefs";
import { getLowestAnchorIndex } from "./utils";

type AnchorsProps = {
  anchors: Anchor[];
  visibleAnchors: string[];
};

export const Anchors = ({ anchors, visibleAnchors }: AnchorsProps) => {
  const anchorRefs = useRef<HTMLDivElement[]>([]);
  const selectedIndex = getLowestAnchorIndex({ visibleAnchors, anchors });

  return (
    <div style={{ display: "flex", flexDirection: "row-reverse" }}>
      <div>
        {anchors.map((anchor) => {
          const { ref, content, id } = anchor;
          return (
            <div
              key={id}
              ref={(ref) => registerAnchorRef({ refs: anchorRefs, ref })}
              onClick={() => {
                ref.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                cursor: "pointer",
                fontWeight: visibleAnchors.includes(id) ? "bolder" : "normal",
              }}
            >
              {content}
            </div>
          );
        })}
      </div>
      <AnimationContainerWrapper onMount={[{ opacity: 0 }, { opacity: 1 }]}>
        {selectedIndex !== -1 ? (
          <HighlightBar key="highlightBar" refs={anchorRefs} selectedIndex={selectedIndex} />
        ) : (
          <></>
        )}
      </AnimationContainerWrapper>
    </div>
  );
};

type HighlightBarProps = {
  refs: RefObject<(HTMLDivElement | null)[]>;
  selectedIndex: number;
};

type TabProperties = {
  height: number;
  top: number;
};

const HighlightBar = ({ refs, selectedIndex }: HighlightBarProps) => {
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
      for (let entry of entries) {
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

    const {} = animate({ element: highlightRef.current, animation, animationOptions });

    lastTab.current = newTabProperties;
  }, [selectedIndex]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div
        ref={highlightRef}
        style={{
          position: "absolute",
          right: "5px",
        }}
      >
        <div key="bar" style={{ width: "5px", height: "inherit", backgroundColor: "#5662F6" }} />
      </div>
    </div>
  );
};
