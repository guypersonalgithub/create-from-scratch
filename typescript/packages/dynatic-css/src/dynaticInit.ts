import { cssBase, type WithConfig, type WithoutConfig } from "./cssBase";
import { initializePreexistingClasses } from "./insertStaticRuleIfNeeded";
import type { ConfigBody, DynaticConfiguration } from "./types";

type DynaticInitArgsWithConfig<T extends DynaticConfiguration, B extends keyof T["variants"]> = {
  config: T;
  base: B;
  classes?: string[];
};

type DynaticInitArgsWithoutConfig = {
  config?: undefined;
  base?: undefined;
  classes?: string[];
};

export function dynaticInit<T extends DynaticConfiguration, B extends keyof T["variants"]>(
  args: DynaticInitArgsWithConfig<T, B>,
): {
  css: (strings: TemplateStringsArray, ...exprs: WithConfig<T>["exprs"]) => string;
};

export function dynaticInit(args: DynaticInitArgsWithoutConfig): {
  css: (strings: TemplateStringsArray, ...exprs: WithoutConfig["exprs"]) => string;
};
export function dynaticInit<
  T extends DynaticConfiguration<V>,
  V extends Record<string, ConfigBody>,
  B extends keyof V,
>({ config, base, classes }: DynaticInitArgsWithConfig<T, B> | DynaticInitArgsWithoutConfig) {
  initializePreexistingClasses({ classes });
  if (typeof base === "string") {
    document.body.classList.add(base);
  }

  return {
    css:
      config && base
        ? (strings: TemplateStringsArray, ...exprs: WithConfig<T>["exprs"]) => {
            const { variants, ...rest } = config;
            return cssBase<T>({ strings, exprs, config: { ...variants[base], ...rest } });
          }
        : (strings: TemplateStringsArray, ...exprs: WithoutConfig["exprs"]) =>
            cssBase({ strings, exprs }),
  };
}
