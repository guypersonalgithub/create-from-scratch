import { useEffect, useRef, useState } from "react";

type TextHighlightingProps = {
  text: string;
  highlightClass: string;
  keywords?: string[];
};

export const TextHighlighting = ({
  text,
  highlightClass,
  keywords = [],
}: TextHighlightingProps) => {
  const [highlighted, setHighlighted] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const textNode = ref.current.firstChild as Text;

    if (!CSS.highlights || !textNode) {
      return;
    }

    if (keywords.length > 0) {
      // Clear previous highlights if any exist
      for (const name of keywords) {
        CSS.highlights.delete(`hl-${name}`);
      }

      // Apply the highlights
      for (const keyword of keywords) {
        const highlight = new Highlight();
        const regex = new RegExp(`\\b${keyword}\\b`, "g");
        let match;
        while ((match = regex.exec(textNode.textContent || "")) !== null) {
          const range = new Range();
          range.setStart(textNode, match.index);
          range.setEnd(textNode, match.index + keyword.length);
          highlight.add(range);
        }
        CSS.highlights.set(`hl-${keyword}`, highlight);
      }
    }
  }, [keywords.join("")]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const textNode = ref.current.firstChild as Text;

    CSS.highlights.delete(`custom-highlight`);
    const highlight = new Highlight();
    const regex = new RegExp(`\\b${highlighted}\\b`, "g");
    let match;
    while ((match = regex.exec(textNode.textContent || "")) !== null) {
      const range = new Range();
      range.setStart(textNode, match.index);
      range.setEnd(textNode, match.index + highlighted.length);
      highlight.add(range);
    }
    CSS.highlights.set("custom-highlight", highlight);
  }, [highlighted]);

  return (
    <div>
      <input value={highlighted} onChange={(e) => setHighlighted(e.target.value)} />
      <div ref={ref}>{text}</div>
    </div>
  );
};
