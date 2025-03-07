import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { spaceFollowUpFlow } from "./spaceFlow";
import { typeFlow } from "./typeFlow";

type TypeAndOrFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const typeAndOrFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: TypeAndOrFlowArgs):
  | {
      updatedIndex: number;
      stop: boolean;
    }
  | undefined => {
  if (newTokenValue !== "&" && newTokenValue !== "|") {
    return;
  }

  const lastToken = previousTokensSummary[previousTokensSummary.length - 1];

  if (lastToken === TokenTypes.TYPE_AND || lastToken === TokenTypes.TYPE_OR) {
    return {
      updatedIndex: currentIndex - newTokenValue.length,
      stop: true,
    };
  }

  const token = {
    type: newTokenValue === "|" ? TokenTypes.TYPE_AND : TokenTypes.TYPE_OR,
    value: newTokenValue,
  };

  tokens.push(token);
  previousTokensSummary.push(token.type);

  const followingType = typeFlow({ tokens, input, currentIndex, previousTokensSummary });

  if (followingType.stop) {
    return followingType;
  }

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: followingType.updatedIndex,
    previousTokensSummary,
  });

  const additionalAndOr = typeAndOrFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  if (!additionalAndOr) {
    return {
      updatedIndex: space?.updatedIndex ?? followingType.updatedIndex,
      stop: false,
    };
  }

  return additionalAndOr;
};
