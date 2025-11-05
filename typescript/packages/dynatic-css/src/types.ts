import type { widthMediaQuery } from "@packages/dynatic-css-utils";

export type ConfigUtilities = {
  utils: {
    widthMediaQuery: typeof widthMediaQuery;
  };
};

export type PlainExpr = string | number | boolean;
export type ConfigExpr<T> = (config: T) => PlainExpr;

// 2-level deep: { key: { value } }
type ShallowConfigBody = Record<string, string | number>;

// 3-level deep: { key: { innerKey: value } }
export type ConfigBody = Record<string, ShallowConfigBody>;

export type DynaticConfiguration<
  V extends Record<string, ConfigBody> = Record<string, ConfigBody>,
> = {
  variants: V;
} & {
  [K: string]: ShallowConfigBody | ConfigBody | number | string | V;
};

type InnerCSSInit<T extends DynaticConfiguration, V extends keyof T["variants"]> = Omit<
  T,
  "variants"
> &
  T["variants"][V];

export type Config<T extends DynaticConfiguration> = InnerCSSInit<T, keyof T["variants"]>;

export type ConfigExpression<T extends DynaticConfiguration> = PlainExpr | ConfigExpr<Config<T & ConfigUtilities>>;
export type ConfiglessExpression = PlainExpr | ConfigExpr<ConfigUtilities>;
