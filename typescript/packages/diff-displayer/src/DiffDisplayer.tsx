import { lineDiff, type Diff } from "@packages/diff";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { parseSections } from "./parseSections";
import { DiffUI } from "./DiffUI";
import { useRef, useEffect } from "react";
import { inlineParse } from "./inlineParse/inlineParse";

type DiffDisplayerProps = DiffProps & {
  className?: string;
  highlightSubDifferences?: boolean;
};

type DiffProps =
  | {
      from: string;
      to: string;
      preparsed?: never[];
    }
  | {
      from?: never;
      to?: never;
      preparsed?: Diff[];
    };

export const DiffDisplayer = ({
  className,
  highlightSubDifferences,
  from,
  to,
  preparsed,
}: DiffDisplayerProps) => {
  const parsedData = preparsed || lineDiff({ from: from!, to: to! }).result;
  const { oldVersion, newVersion, addEmptyIndexes, removeEmptyIndexes } = parseSections({
    parsed: parsedData,
  });
  const { updatedAdd = newVersion, updatedRemove = oldVersion } = highlightSubDifferences
    ? inlineParse({ oldVersion, newVersion, addEmptyIndexes, removeEmptyIndexes })
    : {};
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    // console.log(getVisibleLineCount(containerRef.current));
  }, []);

  return (
    <div
      ref={containerRef}
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          gap: 10px;
          overflow-y: auto;
          line-height: 18px;
          background: white;
          width: fit-content;
          color: black;
          // height: 100px;
        `,
        className,
      )}
    >
      <DiffUI diff={updatedRemove} />
      <DiffUI diff={updatedAdd} />
    </div>
  );
};

export function getVisibleLineCount(el: HTMLElement): number {
  const styles = getComputedStyle(el);

  console.log(styles.lineHeight);

  let lineHeight = styles.lineHeight;
  if (lineHeight === "normal") {
    const fontSize = parseFloat(styles.fontSize);
    // Approximation: browsers typically use 1.2 for "normal"
    lineHeight = String(fontSize * 1.2);
  }

  const lh = parseFloat(lineHeight);
  const visibleHeight = el.clientHeight;

  console.log({ visibleHeight, lh });

  return Math.floor(visibleHeight / lh);
}
