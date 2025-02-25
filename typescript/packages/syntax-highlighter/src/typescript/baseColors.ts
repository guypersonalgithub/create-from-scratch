import { TokenTypeOptions, TokenTypes } from "./constants";

export const baseColors: Record<TokenTypeOptions, string> = {
  [TokenTypes.STRING]: "#CE723C",
  [TokenTypes.VARIABLE]: "#50B9FE",
  [TokenTypes.CONST_VARIABLE]: "#2B1FA8",
  [TokenTypes.DEFINITION]: "#4A9CB3",
  [TokenTypes.FUNCTION]: "#4A9CB3",
  [TokenTypes.NEW]: "#4A9CB3",
  [TokenTypes.TYPE]: "#44C990",
  [TokenTypes.CLASS]: "#44C990",
  [TokenTypes.EXTENDS]: "purple",
  [TokenTypes.JSX]: "darkGreen",
  [TokenTypes.JSX_PROPERTY]: "#50B9FE",
  [TokenTypes.FUNCTION_NAME]: "#DCDCAA",
  [TokenTypes.IMPORT]: "purple",
  [TokenTypes.IMPORT_VARIABLE]: "#50B9FE",
  [TokenTypes.COMMENT]: "darkGreen",
  [TokenTypes.AS]: "purple",
  [TokenTypes.FROM]: "purple",
  [TokenTypes.RETURN]: "purple",
  [TokenTypes.FUNCTION_CURLY_BRACKET]: "white",
  [TokenTypes.IMPORT_CURLY_BRACKET]: "white",
  [TokenTypes.OBJECT_CURLY_BRACKET]: "white",
  [TokenTypes.OBJECT_PROPERTY]: "#50B9FE",
  [TokenTypes.OBJECT_STRING_PROPERTY]: "#CE723C",
  [TokenTypes.BOOLEAN]: "#4A9CB3",
  [TokenTypes.ARROW]: "#4A9CB3",
  [TokenTypes.NUMBER]: "lightGreen",
  [TokenTypes.ANGLE]: "white",
  [TokenTypes.OBJECT_COLON]: "white",
  [TokenTypes.EQUAL]: "white",
  [TokenTypes.END_OF_LINE]: "white",
  [TokenTypes.WHITESPACE]: "white",
  [TokenTypes.COMMA]: "white",
  [TokenTypes.TYPE_COLON]: "white",
  [TokenTypes.TYPE_OR]: "white",
  [TokenTypes.TYPE_AND]: "white",
  [TokenTypes.OPERATOR]: "white",
  [TokenTypes.ARRAY_SQUARE_BRACKET]: "white",
  [TokenTypes.JSX_PROPERTY_EXPRESSION_INTERPOLATION]: "white",
  [TokenTypes.UNDEFINED]: "#4A9CB3",
  [TokenTypes.NULL]: "#4A9CB3",
  [TokenTypes.PARENTHESIS]: "white",
  [TokenTypes.TAG_CONTENT]: "white",
  [TokenTypes.UNKNOWN]: "white",
};
