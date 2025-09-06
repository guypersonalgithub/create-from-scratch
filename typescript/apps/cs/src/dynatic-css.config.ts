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
  what: {
    one: "two",
  },
  test: "1",
} satisfies DynaticConfiguration;

const classes: string[] = [];

export const { css } = dynaticInit({ config, classes, base: "base" });
