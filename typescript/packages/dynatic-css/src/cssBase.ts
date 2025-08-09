import { parse, parseLine } from "./parse";
import type { DynaticConfiguration } from "./types";

type PlainExpr = string | number | boolean;
type ConfigExpr<T> = (config: T) => PlainExpr;

export type WithConfig<T extends DynaticConfiguration> = {
  strings: TemplateStringsArray;
  exprs: (PlainExpr | ConfigExpr<T[keyof T]>)[];
  config: T[keyof T];
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

export function cssBase<T extends DynaticConfiguration = { base: {} }>(
  args: WithConfig<T> | WithoutConfig,
): string {
  const { strings, exprs } = args;
  const config = args.config as T[keyof T];
  const classNames: string[] = [];

  for (let i = 0; i < strings.length; i++) {
    const staticPart = strings[i];
    const expr = exprs[i];

    const splitStatic = staticPart.split(";");
    if (expr) {
      for (let i = 0; i < splitStatic.length - 1; i++) {
        const line = splitStatic[i];
        parseLine({ line, classNames });
      }

      const last = splitStatic[splitStatic.length - 1].trim();
      const expression = typeof expr === "function" ? expr(config) : expr;
      const line = last.length > 0 ? `${last} ${expression}` : `${expression}`;
      parse({ line, classNames });
    } else {
      splitStatic.forEach((line) => parseLine({ line, classNames }));
    }
  }

  return classNames.join(" ");
}
