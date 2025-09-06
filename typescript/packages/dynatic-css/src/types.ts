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

export type InnerCSSInit<T extends DynaticConfiguration, V extends keyof T["variants"]> = Omit<
  T,
  "variants"
> &
  T["variants"][V];
