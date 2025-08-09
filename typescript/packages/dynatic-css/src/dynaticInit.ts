import { cssBase, type WithConfig, type WithoutConfig } from "./cssBase";
import { initializePreexistingClasses } from "./insertStaticRuleIfNeeded";
import type { DynaticConfiguration } from "./types";

type DynaticInitArgsWithConfig<T extends DynaticConfiguration> = {
  config: T;
  base: keyof T;
  classes?: string[];
};

type DynaticInitArgsWithoutConfig = {
  config?: undefined;
  base?: undefined;
  classes?: string[];
};

export function dynaticInit<T extends DynaticConfiguration>(
  args: DynaticInitArgsWithConfig<T>,
): {
  css: (strings: TemplateStringsArray, ...exprs: WithConfig<T>["exprs"]) => string;
};

export function dynaticInit(args: DynaticInitArgsWithoutConfig): {
  css: (strings: TemplateStringsArray, ...exprs: WithoutConfig["exprs"]) => string;
};
export function dynaticInit<T extends DynaticConfiguration>({
  config,
  base,
  classes,
}: DynaticInitArgsWithConfig<T> | DynaticInitArgsWithoutConfig) {
  initializePreexistingClasses({ classes });

  return {
    css: config && base
      ? (strings: TemplateStringsArray, ...exprs: WithConfig<T>["exprs"]) =>
          cssBase<T>({ strings, exprs, config: config[base] })
      : (strings: TemplateStringsArray, ...exprs: WithoutConfig["exprs"]) =>
          cssBase({ strings, exprs }),
  };
}
