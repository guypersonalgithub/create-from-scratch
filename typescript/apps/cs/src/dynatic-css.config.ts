import { type DynaticConfiguration, dynaticInit } from "@packages/dynatic-css";

const config = {
  base: {},
} satisfies DynaticConfiguration;

const classes: string[] = ["css-ngq2wi", "css-1ax4fy4"];

export const { css } = dynaticInit({ config, classes, base: "base" });
