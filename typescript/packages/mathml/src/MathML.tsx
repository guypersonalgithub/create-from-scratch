import { tokenizer } from "@packages/math-parser";
import { RecursiveMathMLToken } from "./JSX/RecursiveMathMLToken";
import { useEffect, useRef } from "react";
import { functionalParsing } from "./functionalParsing";
import { parseTokens } from "./utils/parseTokens";

type MathMLProps = {
  input: string;
  format: "HTML" | "JSX";
};

const getParsedTokens = ({ input }: Pick<MathMLProps, "input">) => {
  const tokens = tokenizer({ input });
  const { parsedTokens } = parseTokens({ tokens });
  return parsedTokens;
};

export const MathML = ({ input, format }: MathMLProps) => {
  if (format === "HTML") {
    return <HTMLFormat input={input} />;
  }

  return <JSXFormat input={input} />;
};

type FormatProps = {
  input: string;
};

const HTMLFormat = ({ input }: FormatProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const parsedTokens = getParsedTokens({ input });
    ref.current.innerHTML = functionalParsing({ parsedTokens });
  }, [input]);

  return <div ref={ref} />;
};

const JSXFormat = ({ input }: FormatProps) => {
  const parsedTokens = getParsedTokens({ input });

  return (
    <math>
      <mrow>
        {parsedTokens.map((parsedToken, index) => {
          const { type } = parsedToken;
          const key = `${type}-${index}`;

          return <RecursiveMathMLToken key={key} token={parsedToken} />;
        })}
      </mrow>
    </math>
  );
};
