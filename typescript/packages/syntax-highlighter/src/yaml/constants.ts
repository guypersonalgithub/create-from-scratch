export const TokenTypes = {
  STRING_KEY: "string-key",
  NUMERIC_KEY: "numeric-key",
  STRING_VALUE: "string-value",
  NUMERIC_VALUE: "numeric-value",
  OPERATOR: "operator",
  OBJECT_CURLY_BRACKET: "objet-curly-bracket",
  ARRAY_SQUARE_BRACKET: "array-square-bracket",
  COMMENT: "comment",
  WHITESPACE: "whitespace",
  END_OF_LINE: "end-of-line",
  UNKNOWN: "unknown",
} as const;

export type TokenTypeOptions = (typeof TokenTypes)[keyof typeof TokenTypes];
