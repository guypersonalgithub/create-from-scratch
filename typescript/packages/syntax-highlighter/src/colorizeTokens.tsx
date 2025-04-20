import { SupportedLanguages } from "./languages";
import { GenericBaseToken, TokenMaps } from "./types";

type ColorizeTokensArgs<T extends SupportedLanguages> = {
  tokens: GenericBaseToken<T>[];
  baseColors: Record<TokenMaps[T], string>;
  cellTypeRebranding?: Record<number, TokenMaps[T]>;
  customCellColors?: Record<number, string>;
};

export const colorizeTokens = <T extends SupportedLanguages>({
  tokens,
  baseColors,
  cellTypeRebranding = {},
  customCellColors = {},
}: ColorizeTokensArgs<T>) => {
  return tokens.map((current, index) => {
    const { type, value } = current;
    const color = customCellColors[index] ?? baseColors[cellTypeRebranding[index] ?? type];
    return <span style={{ color }}>{value}</span>;
  });
};
