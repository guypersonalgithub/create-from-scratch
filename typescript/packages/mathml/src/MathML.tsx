import { tokenizer } from "@packages/math-parser";
import { RecursiveMathMLToken } from "./JSX/RecursiveMathMLToken";
import { useEffect, useRef, useState } from "react";
import { functionalParsing } from "./functionalParsing";
import { parseTokens } from "./utils/parseTokens";

type MathMLProps = {
  input: string;
  format: "HTML" | "JSX";
};

const getParsedTokens = ({ input }: Pick<MathMLProps, "input">) => {
  const { tokens, errorMessage: tokenizerErrorMessage } = tokenizer({ input });
  const { parsedTokens, errorMessage } = parseTokens({ tokens });
  return { parsedTokens, errorMessage: errorMessage || tokenizerErrorMessage };
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
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { parsedTokens, errorMessage } = getParsedTokens({ input });
    setError(errorMessage);
    if (errorMessage) {
      ref.current.innerHTML = "";
      return;
    }

    ref.current.innerHTML = functionalParsing({ parsedTokens });
  }, [input]);

  return (
    <>
      <div>{error}</div>
      <div ref={ref} style={{ visibility: error ? "hidden" : "visible" }} />
    </>
  );
};

const JSXFormat = ({ input }: FormatProps) => {
  const { parsedTokens, errorMessage } = getParsedTokens({ input });

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

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
