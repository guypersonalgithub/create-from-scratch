import type {
  Config,
  ConfigExpr,
  ConfigExpression,
  ConfiglessExpression,
  ConfigUtilities,
  DynaticConfiguration,
} from "./types";
import { parseHelpers } from "./helpers";
import { parseLine } from "./parse";
import { splitCombinedTemplate } from "./splitCombinedTemplate";
import { splitOnSpaceOrNewline } from "@packages/string-utils";

export type WithConfig<T extends DynaticConfiguration> = {
  config: Config<T>;
  strings: TemplateStringsArray;
  exprs: ConfigExpression<T>[];
};

export type WithoutConfig = {
  config: ConfigUtilities;
  strings: TemplateStringsArray;
  exprs: ConfiglessExpression[];
};

// Overload 1: with config
export function cssBase<T extends DynaticConfiguration>(args: WithConfig<T>): string;

// Overload 2: without config
export function cssBase<T extends ConfigUtilities>(args: WithoutConfig): string;

export function cssBase<T extends DynaticConfiguration | undefined>(
  args: T extends DynaticConfiguration ? WithConfig<T> : WithoutConfig,
): string {
  const { config, strings, exprs } = args;
  const classNames: string[] = [];
  let mediaQuery: string | undefined;
  let pseudoClass: string | undefined;

  const combinedTemplate = (
    exprs.length > 0
      ? strings.map((current, index) => {
          // TODO: Look for a better combining function that might be more performant.
          const currentExpression = exprs[index];

          if (currentExpression) {
            const expressionAddition =
              typeof currentExpression === "function"
                ? currentExpression(
                    config as T extends DynaticConfiguration
                      ? ConfigExpr<T & ConfigUtilities>
                      : any, // ConfigUtilities
                  )
                : currentExpression;

            return `${current}${expressionAddition}`;
          }

          return current;
        })
      : strings
  ).join("");

  const cssLines = splitCombinedTemplate({ combinedTemplate });

  for (let i = 0; i < cssLines.length; i++) {
    const str = cssLines[i];
    const parsed = splitOnSpaceOrNewline({ str });

    if (parsed.length > 0) {
      const line = parsed.reduce((line, current, index) => {
        const lastChar = current[current.length - 1];

        if (lastChar === "(" || lastChar === ")" || index === parsed.length - 1) {
          return line + current;
        }

        return line + current + " ";
      }, "");

      const updated = parseHelpers({ line, mediaQuery, pseudoClass });
      if (updated.continue) {
        mediaQuery = updated.mediaQuery;
        pseudoClass = updated.pseudoClass;
        continue;
      }

      parseLine({ line, classNames, pseudoClass, mediaQuery });
    }
  }

  return classNames.join(" ");
}
