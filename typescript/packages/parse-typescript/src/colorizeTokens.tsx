import { baseColors } from "./baseColors";
import { BaseToken } from "./types";

type ColorizeTokensArgs = {
  tokens: BaseToken[];
};

export const colorizeTypescriptTokens = ({ tokens }: ColorizeTokensArgs) => {
  return tokens.map((current) => {
    const { type, value } = current;
    const color = baseColors[type];
    return <span style={{ color }}>{value}</span>;
  });
};
