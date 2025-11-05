import { widthMediaQuery } from "@packages/dynatic-css-utils";
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
  initializeDynatic: () => void;
  dynatic: (strings: TemplateStringsArray, ...exprs: WithConfig<T>["exprs"]) => string;
};

export function dynaticInit(args: DynaticInitArgsWithoutConfig): {
  initializeDynatic: () => void;
  dynatic: (strings: TemplateStringsArray, ...exprs: WithoutConfig["exprs"]) => string;
};
export function dynaticInit<
  T extends DynaticConfiguration<V>,
  V extends Record<string, ConfigBody>,
  B extends keyof V,
>({ config, base, classes }: DynaticInitArgsWithConfig<T, B> | DynaticInitArgsWithoutConfig) {
  return {
    initializeDynatic: () => {
      initializePreexistingClasses({ classes });
      if (typeof base === "string") {
        document.body.classList.add(base);
      }
    },
    dynatic:
      config && base
        ? (strings: TemplateStringsArray, ...exprs: WithConfig<T>["exprs"]) => {
            const { variants, ...rest } = config;
            return cssBase<T>({
              strings,
              exprs,
              config: { ...variants[base], ...rest, utils: { widthMediaQuery } },
            });
          }
        : (strings: TemplateStringsArray, ...exprs: WithoutConfig["exprs"]) =>
            cssBase({ strings, exprs, config: { utils: { widthMediaQuery }} }),
  };
}
