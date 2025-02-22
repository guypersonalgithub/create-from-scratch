import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";

type TagFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  nested?: boolean;
};

export const tagFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  nested,
}: TagFlowArgs) => {
  const currentTokens: BaseToken[] = [];
  let currentTokenValue = "";
  let updatedIndex = currentIndex;
  let isParenthesis = input.charAt(currentIndex) === "(";

  while (updatedIndex < input.length) {
    let current = input.charAt(updatedIndex);
    if (current === "<") {
      const nestedTag = tagFlow({
        tokens,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
        nested: true,
      });
    } else if (current === ">") {
      const previous = input.charAt(updatedIndex - 1);
      if (previous === "=") {
        return {
          updatedIndex: currentIndex,
          stop: !isParenthesis && !nested,
          isType: isParenthesis,
        };
      } else if (previous === "/") {
        return {
          updatedIndex,
          stop: false,
        };
      }

      return {
        updatedIndex,
        stop: true,
      };
    } else if (["[", "]", "(", ")", "{", "}"].includes(current)) {
      currentTokens.push({ type: TokenTypes.TAG_CONTENT, value: currentTokenValue });
      currentTokens.push({ type: getUniqueTokenType({ current }), value: current });
      currentTokenValue = "";

      if (current === "{") {
        // value flow / function flow
      }
    }

    updatedIndex++;
  }

  if (!nested) {
    tokens.push(...currentTokens);
  }

  return {
    updatedIndex,
    stop: false,
  };
};

type GetUniqueTokenTypeArgs = {
  current: string;
};

const getUniqueTokenType = ({ current }: GetUniqueTokenTypeArgs) => {
  const tokenTypes: Record<string, TokenTypeOptions> = {
    "[": TokenTypes.ARRAY_SQUARE_BRACKET,
    "]": TokenTypes.ARRAY_SQUARE_BRACKET,
    "(": TokenTypes.PARENTHESIS,
    ")": TokenTypes.PARENTHESIS,
    "{": TokenTypes.OBJECT_CURLY_BRACKET,
    "}": TokenTypes.OBJECT_CURLY_BRACKET,
  };

  return tokenTypes[current];
};
