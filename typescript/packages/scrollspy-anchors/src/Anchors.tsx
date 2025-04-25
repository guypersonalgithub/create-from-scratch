import { AnimationContainerWrapper } from "@packages/animation-container";
import { Anchor } from "./types";
import { useRef, RefObject, useState, useMemo, useEffect } from "react";
import { registerAnchorRef } from "./registerRefs";
import { getLowestAnchorIndex } from "./utils";

type AnchorsProps = {
  anchors: Anchor[];
  visibleAnchors: string[];
};

export const Anchors = ({ anchors, visibleAnchors }: AnchorsProps) => {
  const anchorRefs = useRef<HTMLDivElement[]>([]);
  const isInitialState = useRef<boolean>(true);
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
                isInitialState.current = false;
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
      <HighlightBar
        refs={anchorRefs}
        selectedIndex={selectedIndex}
        isInitialState={isInitialState.current}
      />
    </div>
  );
};

type HighlightBarProps = {
  refs: RefObject<(HTMLDivElement | null)[]>;
  selectedIndex: number;
  isInitialState: boolean;
};

type TabProperties = {
  height: number;
  top: number;
};

const HighlightBar = ({ refs, selectedIndex, isInitialState }: HighlightBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerTop = useRef<number>(0);
  const lastTab = useRef<TabProperties>({
    height: 0,
    top: 0,
  });
  const [tabProperties, setTabPropeties] = useState<TabProperties>({
    height: 0,
    top: 0,
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const setContainertop = () => {
      if (!containerRef.current) {
        return;
      }

      const { top } = containerRef.current.getBoundingClientRect();
      containerTop.current = top;
    };

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          setContainertop();
        }
      }
    });

    observer.observe(containerRef.current);

    setContainertop();

    return () => {
      if (!containerRef.current) {
        return;
      }

      observer.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
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

    if (tabProperties.top > 0) {
      lastTab.current = tabProperties;
    }
    setTabPropeties(getRefProperties(refs.current[selectedIndex]));
  }, [selectedIndex]);

  const animation = useMemo(() => {
    return [
      { height: `${lastTab.current.height}px`, transform: `translateY(${lastTab.current.top}px)` },
      {
        height: `${tabProperties.height}px`,
        transform: `translateY(${tabProperties.top}px)`,
      },
    ];
  }, [tabProperties]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <AnimationContainerWrapper
        animation={animation}
        animationOptions={{ duration: 300, easing: "ease-out" }}
        style={{
          position: "absolute",
          height: `${tabProperties.height}px`,
          right: "5px",
          top: `${tabProperties.top}px`,
        }}
        disableAnimation={isInitialState}
      >
        <div key="bar" style={{ width: "5px", height: "inherit", backgroundColor: "#5662F6" }} />
      </AnimationContainerWrapper>
    </div>
  );
};
