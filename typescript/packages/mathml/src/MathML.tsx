import { tokenizer } from "@packages/math-parser";
import { RecursiveMathMLToken } from "./JSX/RecursiveMathMLToken";
import { useLayoutEffect, useRef, useState } from "react";
import { functionalParsing } from "./functionalParsing";
import { parseTokens } from "./utils/parseTokens";

type MathMLProps = {
  input: string;
  format?: "HTML" | "JSX";
  isAnExpression?: boolean;
  displayError?: boolean;
  consoleError?: boolean;
};

const getParsedTokens = ({
  input,
  isAnExpression,
}: Pick<MathMLProps, "input" | "isAnExpression">) => {
  const { tokens, errorMessage: tokenizerErrorMessage } = tokenizer({ input, isAnExpression });
  const { parsedTokens, errorMessage } = parseTokens({ tokens });
  return { parsedTokens, errorMessage: errorMessage || tokenizerErrorMessage };
};

export const MathML = ({
  input,
  format = "HTML",
  isAnExpression,
  displayError = true,
  consoleError,
}: MathMLProps) => {
  if (format === "HTML") {
    return (
      <HTMLFormat
        input={input}
        isAnExpression={isAnExpression}
        displayError={displayError}
        consoleError={consoleError}
      />
    );
  }

  return (
    <JSXFormat
      input={input}
      isAnExpression={isAnExpression}
      displayError={displayError}
      consoleError={consoleError}
    />
  );
};

type FormatProps = Omit<MathMLProps, "format">;

const HTMLFormat = ({ input, isAnExpression, displayError, consoleError }: FormatProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | undefined>();

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const { parsedTokens, errorMessage } = getParsedTokens({ input, isAnExpression });
    setError(errorMessage);
    if (errorMessage) {
      if (consoleError) {
        console.error(error);
      }
      ref.current.innerHTML = "";
      return;
    }

    ref.current.innerHTML = functionalParsing({ parsedTokens });
  }, [input]);

  return (
    <>
      {displayError ? <div>{error}</div> : null}
      <div ref={ref} style={{ visibility: error ? "hidden" : "visible" }} />
    </>
  );
};

const JSXFormat = ({ input, isAnExpression, displayError, consoleError }: FormatProps) => {
  const { parsedTokens, errorMessage } = getParsedTokens({ input, isAnExpression });

  if (errorMessage) {
    if (consoleError) {
      console.error(errorMessage);
    }

    if (displayError) {
      return <div>{errorMessage}</div>;
    }
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
