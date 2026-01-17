import { type DynaticConfiguration, dynaticInit } from "@packages/dynatic-css";

const config = {
  variants: {
    base: {
      colors: {
        red: "red",
        blue: "blue",
      },
    },
  },
  shared: {
    colors: {
      white: "white",
      yellow: "yellow",
    },
  },
  uniqueClasses: {
    group: "group",
    child: "child",
    parent: "parent",
    char: "char",
  },
} as const satisfies DynaticConfiguration;

const classes: string[] = [];

export const { dynatic } = dynaticInit({ config, classes, base: "base" });
