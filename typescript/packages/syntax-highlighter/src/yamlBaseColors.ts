import { YAMLTokenTypeOptions, YAMLTokenTypes } from "@packages/parse-yaml";

export const yamlBaseColors: Record<YAMLTokenTypeOptions, string> = {
  [YAMLTokenTypes.STRING_KEY]: "#4A9CB3",
  [YAMLTokenTypes.NUMERIC_KEY]: "lightGreen",
  [YAMLTokenTypes.STRING_VALUE]: "#CE723C",
  [YAMLTokenTypes.NUMERIC_VALUE]: "lightGreen",
  [YAMLTokenTypes.COMMENT]: "darkGreen",
  [YAMLTokenTypes.OBJECT_CURLY_BRACKET]: "white",
  [YAMLTokenTypes.END_OF_LINE]: "white",
  [YAMLTokenTypes.WHITESPACE]: "white",
  [YAMLTokenTypes.OPERATOR]: "white",
  [YAMLTokenTypes.ARRAY_SQUARE_BRACKET]: "white",
  [YAMLTokenTypes.UNKNOWN]: "white",
};
