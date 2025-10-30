import { parseHelpers } from "./helpers";
import { parseLine } from "./parse";
import { splitCombinedTemplate } from "./splitCombinedTemplate";
import type { DynaticConfiguration, InnerCSSInit } from "./types";
import { splitOnSpaceOrNewline } from "@packages/string-utils";

type PlainExpr = string | number | boolean;
type ConfigExpr<T> = (config: T) => PlainExpr;
type Config<T extends DynaticConfiguration> = InnerCSSInit<T, keyof T["variants"]>;

export type WithConfig<T extends DynaticConfiguration> = {
  strings: TemplateStringsArray;
  exprs: (PlainExpr | ConfigExpr<Config<T>>)[];
  config: Config<T>;
};

export type WithoutConfig = {
  config?: never;
  strings: TemplateStringsArray;
  exprs: (PlainExpr | (() => PlainExpr))[];
};

// Overload 1: with config
export function cssBase<T extends DynaticConfiguration>(args: WithConfig<T>): string;

// Overload 2: without config
export function cssBase(args: WithoutConfig): string;

export function cssBase<T extends DynaticConfiguration = { variants: { base: {} } }>(
  args: WithConfig<T> | WithoutConfig,
): string {
  const { config, strings, exprs } = args;
  const classNames: string[] = [];
  let mediaQuery: string | undefined;
  let pseudoClass: string | undefined;

  // console.log({ strings, exprs });

  const combinedTemplate = (
    exprs.length > 0
      ? strings.map((current, index) => {
          // TODO: Look for a better combining function that might be more performant.
          const currentExpression = exprs[index];

          if (currentExpression) {
            const expressionAddition =
              typeof currentExpression === "function"
                ? currentExpression(config as Config<T>)
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
