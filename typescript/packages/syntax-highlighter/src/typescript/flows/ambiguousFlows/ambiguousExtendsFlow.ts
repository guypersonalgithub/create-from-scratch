import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { typeValueFlow } from "../typeFlows";

type AmbiguousExtendsFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const ambiguousExtendsFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
}: AmbiguousExtendsFlowArgs) => {
  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });
  if (breakpoint.newTokenValue !== "extends") {
    return {
      updatedIndex: space?.updatedIndex ?? currentIndex,
      stop: false,
      hasExtends: false,
      completeExtends: false,
    };
  }

  tokens.push({ type: TokenTypes.JSX_PROPERTY, value: breakpoint.newTokenValue });
  const extendsIndex = tokens.length - 1;

  const { breakpoint: breakpoint2, space: space2 } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: breakpoint.currentIndex,
    previousTokensSummary,
  });

  if (breakpoint2.newTokenValue === "/" || breakpoint2.newTokenValue === ">") {
    return {
      updatedIndex: space2?.updatedIndex ?? breakpoint.currentIndex,
      stop: false,
      hasExtends: true,
      completeExtends: false,
    };
  }

  const valueTokens = typeValueFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint2,
  });

  if (!valueTokens) {
    return {
      updatedIndex: space2?.updatedIndex ?? breakpoint.currentIndex,
      stop: true,
    };
  }

  if (valueTokens.stop) {
    return {
      updatedIndex: valueTokens.updatedIndex,
      stop: true,
      hasExtends: true,
      completeExtends: false,
    };
  }

  // if (!valueTokens.addedNewToken) {
  //   return {
  //     updatedIndex: space2?.updatedIndex ?? breakpoint.currentIndex,
  //     stop: false,
  //     hasExtends: true,
  //     completeExtends: false,
  //   };
  // }

  tokens[extendsIndex].type = TokenTypes.EXTENDS;

  return {
    updatedIndex: valueTokens.updatedIndex,
    stop: false,
    hasExtends: true,
    completeExtends: true,
  };
};
