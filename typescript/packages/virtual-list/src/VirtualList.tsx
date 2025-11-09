import { type ReactNode, useRef, useState, useEffect, useCallback } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

// TODO: Add support for a single ReactNode child.

type VirtualListProps = {
  children: ReactNode[];
  itemHeight: number;
  containerHeight: number;
  buffer?: number;
  className: string;
};

export const VirtualList = ({
  children,
  itemHeight,
  containerHeight,
  buffer = 20,
  className,
}: VirtualListProps) => {
  const [scrollOffset, setScrollOffset] = useState(0);

  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - buffer);
  const endIndex = Math.min(children.length - 1, startIndex + visibleItemCount + buffer * 2);

  const [visibleItems, setVisibleItems] = useState<ReactNode[]>(
    children.slice(startIndex, endIndex + 1),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const updateVisibleItems = useCallback(() => {
    setVisibleItems(children.slice(startIndex, endIndex + 1));
  }, [startIndex, endIndex, children]);

  useEffect(() => {
    updateVisibleItems();
  }, [startIndex, endIndex, children, updateVisibleItems]);

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

  const placeholderHeight = Math.max(children.length * itemHeight, containerHeight);

  return (
    <div
      ref={containerRef}
      className={combineStringsWithSpaces(
        dynatic`
          height: ${containerHeight}px;
          overflow-y: auto;
          position: relative;
        `,
        className,
      )}
    >
      <div
        className={dynatic`
          height: ${placeholderHeight}px;
          position: relative;
        `}
      >
        {visibleItems.map((child, index) => (
          <div
            key={startIndex + index}
            className={dynatic`
              height: ${itemHeight}px;
              width: 100%;
              position: absolute;  
            `}
            style={{
              top: `${(startIndex + index) * itemHeight}px`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
