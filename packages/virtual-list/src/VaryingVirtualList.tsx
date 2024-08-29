import { useRef, useState, useEffect, ReactNode, CSSProperties } from "react";

type ItemProps = {
  index: number;
  measure: (index: number, height: number) => void;
  style: CSSProperties;
  children: ReactNode;
};

type VirtualListProps = {
  items: ReactNode[];
  containerHeight: number;
  bufferSize?: number;
};

const Item = ({ index, measure, style, children }: ItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      const observer = new ResizeObserver(([entry]) => {
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
    <div ref={itemRef} style={style}>
      {children}
    </div>
  );
};

export const VaryingVirtualList = ({
  items,
  containerHeight,
  bufferSize = 5,
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
    while (start < items.length && accumulatedHeight + itemHeights[start] < scrollOffset) {
      accumulatedHeight += itemHeights[start];
      start++;
    }

    end = start;
    accumulatedHeight = accumulatedHeight + itemHeights[start];
    while (end < items.length && accumulatedHeight < scrollOffset + containerHeight) {
      accumulatedHeight += itemHeights[end];
      end++;
    }

    start = Math.max(0, start - bufferSize);
    end = Math.min(items.length - 1, end + bufferSize);

    setVisibleRange({ start, end });
  }, [scrollOffset, containerHeight, itemHeights, bufferSize, items.length]);

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
    if (items.length > 0 && itemHeights.length === 0) {
      setItemHeights(new Array(items.length).fill(100));
    }
  }, [items.length]);

  return (
    <div
      ref={containerRef}
      style={{
        height: `${containerHeight}px`,
        overflowY: "auto",
        position: "relative",
      }}
    >
      <div
        style={{
          height: `${totalHeight}px`,
          position: "relative",
        }}
      >
        {items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => (
          <Item
            key={visibleRange.start + index}
            index={visibleRange.start + index}
            measure={(index, height) => {
              setItemHeights((prevHeights) => {
                const newHeights = [...prevHeights];
                newHeights[index] = height;
                return newHeights;
              });
            }}
            style={{
              position: "absolute",
              top: `${itemHeights.slice(0, visibleRange.start + index).reduce((acc, h) => acc + h, 0)}px`,
              left: 0,
              right: 0,
            }}
          >
            {item}
          </Item>
        ))}
      </div>
    </div>
  );
};
