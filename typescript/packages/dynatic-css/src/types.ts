import type { widthMediaQuery, descendantSelector } from "@packages/dynatic-css-utils";

type UniqueClassValues<T extends DynaticConfiguration> =
  T['uniqueClasses'] extends Record<string, string>
    ? T['uniqueClasses'][keyof T['uniqueClasses']]
    : string;


export type ConfigUtilities<T extends DynaticConfiguration = { variants: {} }> = {
  utils: {
    widthMediaQuery: typeof widthMediaQuery;
    descendantSelector: typeof descendantSelector<UniqueClassValues<T>>;
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
  U extends Record<string, string> = Record<string, string>,
> = {
  variants: V;
  uniqueClasses?: U;
} & {
  [K: string]: ShallowConfigBody | ConfigBody | number | string | V;
};

type InnerCSSInit<T extends DynaticConfiguration, V extends keyof T["variants"]> = Omit<
  T,
  "variants"
> &
  T["variants"][V];

export type Config<T extends DynaticConfiguration> = InnerCSSInit<T, keyof T["variants"]>;

export type ConfigExpression<T extends DynaticConfiguration> =
  | PlainExpr
  | ConfigExpr<Config<T & ConfigUtilities<T>>>;
export type ConfiglessExpression = PlainExpr | ConfigExpr<ConfigUtilities>;
