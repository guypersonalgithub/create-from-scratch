import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { useRef, useState, useEffect, type ReactNode, type CSSProperties } from "react";

// TODO: Add support for a single ReactNode child.

type ItemProps = {
  index: number;
  measure: (index: number, height: number) => void;
  height: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

type VirtualListProps = {
  children: ReactNode[];
  containerHeight: number;
  bufferSize?: number;
  fallbackHeight?: number;
};

const Item = ({ index, measure, height, className, style, children }: ItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      const observer = new ResizeObserver(([entry]) => {
        if (height === entry.contentRect.height) {
          return;
        }

        if (entry && entry.contentRect.height) {
          measure(index, entry.contentRect.height);
        }
      });

      observer.observe(itemRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [index, measure]);

  return (
    <div ref={itemRef} className={className} style={style}>
      {children}
    </div>
  );
};

export const VaryingVirtualList = ({
  children,
  containerHeight,
  bufferSize = 5,
  fallbackHeight = 100,
}: VirtualListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const totalHeight = itemHeights.reduce((acc, height) => acc + height, 0);

  useEffect(() => {
    let start = 0;
    let end = 0;

    let accumulatedHeight = 0;
    while (start < children.length && accumulatedHeight + itemHeights[start] < scrollOffset) {
      accumulatedHeight += itemHeights[start];
      start++;
    }

    end = start;
    accumulatedHeight = accumulatedHeight + itemHeights[start];
    while (end < children.length && accumulatedHeight < scrollOffset + containerHeight) {
      accumulatedHeight += itemHeights[end];
      end++;
    }

    start = Math.max(0, start - bufferSize);
    end = Math.min(children.length - 1, end + bufferSize);

    setVisibleRange({ start, end });
  }, [scrollOffset, containerHeight, itemHeights, bufferSize, children.length]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) {
      return;
    }

    const handleScroll = () => {
      if (currentContainer) {
        const newScrollOffset = currentContainer.scrollTop;
        setScrollOffset(newScrollOffset);
      }
    };

    currentContainer.addEventListener("scroll", handleScroll);

    return () => {
      currentContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (children.length > 0 && itemHeights.length === 0) {
      setItemHeights(children.map(() => fallbackHeight));
    }
  }, [children.length, fallbackHeight]);

  return (
    <div
      ref={containerRef}
      className={combineStringsWithSpaces(
        dynatic`
          height: ${containerHeight}px; 
          overflow-y: auto;
          position: relative;
        `,
        children.length > 0
          ? dynatic`
              opacity: 1;
              pointer-events: all;
            `
          : dynatic`
              opacity: 0;
              pointer-events: none;
            `,
      )}
    >
      <div
        className={dynatic`
          height: ${totalHeight}px;
          position: relative;
        `}
      >
        {children.slice(visibleRange.start, visibleRange.end + 1).map((child, index) => {
          const realIndex = visibleRange.start + index;
          const top = itemHeights.slice(0, realIndex).reduce((acc, h) => acc + h, 0);

          return (
            <Item
              key={realIndex}
              index={realIndex}
              measure={(index, height) => {
                setItemHeights((prevHeights) => {
                  const newHeights = [...prevHeights];
                  newHeights[index] = height;

                  return newHeights;
                });
              }}
              height={itemHeights[realIndex]}
              className={dynatic`
                position: absolute;
                left: 0;
                right: 0;  
              `}
              style={{
                top: `${top}px`,
              }}
            >
              {child}
            </Item>
          );
        })}
      </div>
    </div>
  );
};
