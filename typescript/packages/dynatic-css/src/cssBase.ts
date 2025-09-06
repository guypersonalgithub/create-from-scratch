import { parseHelpers } from "./helpers";
import { parseLine } from "./parse";
import type { DynaticConfiguration, InnerCSSInit } from "./types";

type PlainExpr = string | number | boolean;
type ConfigExpr<T> = (config: T) => PlainExpr;

export type WithConfig<T extends DynaticConfiguration> = {
  strings: TemplateStringsArray;
  exprs: (PlainExpr | ConfigExpr<InnerCSSInit<T, keyof T["variants"]>>)[];
  config: InnerCSSInit<T, keyof T["variants"]>;
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

  console.log({ strings, exprs });

  for (let i = 0; i < strings.length; i++) {
    const staticPart = strings[i];
    const expr = exprs[i];

    const splitStatic = staticPart.split("\n").map((part) => part.replaceAll(";", "").trim());
    if (expr) {
      for (let j = 0; j < splitStatic.length - 1; j++) {
        const line = splitStatic[j];

        if (!line) {
          continue;
        }

        const updated = parseHelpers({ line, mediaQuery, pseudoClass });
        if (updated.continue) {
          mediaQuery = updated.mediaQuery;
          pseudoClass = updated.pseudoClass;
          continue;
        }

        parseLine({ line, classNames, pseudoClass, mediaQuery });
      }

      const last = splitStatic[splitStatic.length - 1].trim();
      const expression =
        typeof expr === "function" ? expr(config as InnerCSSInit<T, keyof T["variants"]>) : expr;
      const line = last.length > 0 ? `${last} ${expression}` : `${expression}`;
      parseLine({ line, classNames, pseudoClass, mediaQuery });
    } else {
      splitStatic.forEach((line) => {
        if (!line) {
          return;
        }

        const updated = parseHelpers({ line, mediaQuery, pseudoClass });
        if (updated.continue) {
          mediaQuery = updated.mediaQuery;
          pseudoClass = updated.pseudoClass;
          return;
        }

        parseLine({ line, classNames, pseudoClass, mediaQuery });
      });
    }
  }

  return classNames.join(" ");
}
