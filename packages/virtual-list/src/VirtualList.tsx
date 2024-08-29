import { ReactNode, useRef, useState, useEffect, useCallback } from "react";

type VirtualListProps = {
  items: ReactNode[];
  itemHeight: number;
  containerHeight: number;
};

export const VirtualList = ({ items, itemHeight, containerHeight }: VirtualListProps) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [visibleItems, setVisibleItems] = useState<ReactNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItemCount = Math.ceil(containerHeight / itemHeight);

  // Temp hard coded buffer
  const buffer = 20;

  const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - buffer);
  const endIndex = Math.min(items.length - 1, startIndex + visibleItemCount + buffer * 2);

  const updateVisibleItems = useCallback(() => {
    setVisibleItems(items.slice(startIndex, endIndex + 1));
  }, [startIndex, endIndex, items]);

  useEffect(() => {
    updateVisibleItems();
  }, [startIndex, endIndex, items, updateVisibleItems]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      if (!container) {
        return;
      }

      const scrollTop = container.scrollTop;
      setScrollOffset(scrollTop);
      updateVisibleItems();
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [updateVisibleItems]);

  const placeholderHeight = Math.max(items.length * itemHeight, containerHeight);

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
          height: `${placeholderHeight}px`,
          position: "relative",
        }}
      >
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              height: `${itemHeight}px`,
              width: "100%",
              position: "absolute",
              top: `${(startIndex + index) * itemHeight}px`,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
