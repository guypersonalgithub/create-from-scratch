import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getComptuedStyleProperties } from "@packages/element-utils";
import { type Animated } from "./types";
import { type SupportedLanguages } from "./languages";
import { ModernContentDesign, type Variant } from "./ModernContentDesign";
import { SimpleContentDesign } from "./SimpleContentDesign";

type AnimatedCodeProps = {
  code: string;
  style?: CSSProperties;
  copyToClipboard?: boolean;
  language?: SupportedLanguages;
  displayLanguage?: boolean;
  modernVersion?: boolean;
  variant?: Variant;
} & Animated;

export const AnimatedCode = ({
  code,
  withCursor,
  pacing = 100,
  style,
  copyToClipboard,
  language,
  displayLanguage,
  modernVersion = true,
  variant,
}: AnimatedCodeProps) => {
  const amountOfLines = useRef<number>(1);
  const [displayedCode, setDisplayedCode] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIndex = useRef<number>(0);
  const ref = useRef<HTMLPreElement>(null);
  const [potentialHeight, setPotentialHeight] = useState(0);
  const currentCode = useRef<string>(`${amountOfLines.current} `);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const { lineHeight } = getComptuedStyleProperties({
      element: ref.current,
      properties: ["lineHeight"],
    });
    const amountOfLines = code.split("\n").length;
    const numericLineHeight = parseFloat(lineHeight);
    setPotentialHeight(numericLineHeight * amountOfLines);
  }, [code, style]);

  useEffect(() => {
    if (cursorIndex.current === 0 || currentCode.current === code) {
      return;
    }

    cursorIndex.current = 0;
    amountOfLines.current = 1;
    currentCode.current = `${amountOfLines.current} `;
    setDisplayedCode("");
  }, [code]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (cursorIndex.current === code.length && intervalRef.current) {
        clearInterval(intervalRef.current);

        return;
      }

      const splitCode = code.slice(cursorIndex.current, cursorIndex.current + 6);
      cursorIndex.current += splitCode.length;
      let transformedSplitCode = "";

      for (let i = 0; i < splitCode.length; i++) {
        const char = splitCode[i];
        if (char === "\n") {
          amountOfLines.current++;
          transformedSplitCode += `\n${amountOfLines.current} `;
        } else {
          transformedSplitCode += char;
        }
      }

      currentCode.current = currentCode.current + transformedSplitCode;
      setDisplayedCode(currentCode.current);
    }, pacing);

    return () => {
      if (!intervalRef.current) {
        return;
      }

      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [code, pacing]);

  if (modernVersion) {
    return (
      <ModernContentDesign
        style={style}
        contentStyle={{
          height: potentialHeight > 0 ? `${potentialHeight}px` : undefined,
        }}
        code={displayedCode}
        highlighted={[]}
        language={"typescript"}
        copyToClipboard={copyToClipboard}
        displayLanguage={displayLanguage}
        addLineCounter={false}
        variant={variant}
        ref={ref}
      />
    );
  }

  return (
    <SimpleContentDesign
      style={style}
      code={displayedCode}
      highlighted={[]}
      language={"typescript"}
      copyToClipboard={copyToClipboard}
      displayLanguage={displayLanguage}
      addLineCounter={false}
    />
  );
};
