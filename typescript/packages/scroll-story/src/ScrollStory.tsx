import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { SectionData } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type ScrollStoryProps = {
  className?: string;
  style?: CSSProperties;
  sections: SectionData[];
};

export const ScrollStory = ({ className, style, sections }: ScrollStoryProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // Find section in viewport center
      let index = 0;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionTop = i * containerHeight;
        if (scrollTop >= sectionTop - containerHeight / 2) {
          index = i;
          break;
        }
      }

      setActiveIndex(index);
    };

    handleScroll();

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={combineStringsWithSpaces(
        dynatic`
          height: 100vh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
        `,
        className,
      )}
      style={style}
    >
      {sections.map((section, i) => {
        const isCurrentSection = i === activeIndex;
        return (
          <div
            key={section.id}
            className={combineStringsWithSpaces(
              dynatic`
                height: 100vh;
                scroll-snap-align: start;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s, opacity 0.3s;
            `,
              isCurrentSection
                ? dynatic`
                    transform: scale(1);
                    opacity: 1;
                  `
                : dynatic`
                    transform: scale(0.95);
                    opacity: 0.6;
                  `,
              section.className,
            )}
          >
            {section.content}
          </div>
        );
      })}
    </div>
  );
};
