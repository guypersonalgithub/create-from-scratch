import { tokenizer } from "@packages/math-parser";
import { RecursiveMathMLToken } from "./JSX/RecursiveMathMLToken";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { functionalParsing } from "./functionalParsing";
import { parseTokens } from "./utils/parseTokens";
import "./styles.css";
import { dynatic } from "@packages/dynatic-css";

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
  const cancelContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | undefined>();

  useLayoutEffect(() => {
    if (!ref.current || !cancelContainerRef.current) {
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

  useEffect(() => {
    if (!ref.current || !cancelContainerRef.current || !isAnExpression) {
      return;
    }

    const clearCancelLines = () => {
      if (!cancelContainerRef.current) {
        return;
      }

      cancelContainerRef.current.innerHTML = "";
    };

    clearCancelLines();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === ref.current) {
          clearCancelLines();

          const cancelElements = ref.current.querySelectorAll(".mathCancelSign");

          cancelElements.forEach((el) => {
            const element = el as HTMLElement;
            const rect = element.getBoundingClientRect();
            const angle = Math.atan(rect.height / rect.width) * (180 / Math.PI);

            const line = document.createElement("div");
            line.classList.add("mathCancelSignLine");

            line.style.left = `${rect.left}px`;
            line.style.top = `${rect.top + rect.height / 2}px`;
            line.style.width = `${rect.width}px`;
            line.style.transform = `rotate(${-angle}deg)`;

            element.style.position = "relative";

            cancelContainerRef.current?.appendChild(line);
          });
        }
      }
    });

    observer.observe(ref.current);

    return () => {
      if (!ref.current) {
        return;
      }

      observer.unobserve(ref.current);
    };
  }, [isAnExpression]);

  return (
    <div>
      {displayError ? <div>{error}</div> : null}
      <div
        ref={ref}
        className={
          error
            ? dynatic`
                visibility: hidden;
              `
            : dynatic`
                visibility: visible;
              `
        }
      />
      <div ref={cancelContainerRef} />
    </div>
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
