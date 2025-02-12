import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { spaceFollowUpFlow } from "./spaceFlow";
import { valueFlow } from "./valueFlow";

type ExtendsFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const extendsFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
}: ExtendsFlowArgs) => {
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

  const valueTokens = valueFlow({
    tokens,
    input,
    newTokenValue: breakpoint2.newTokenValue,
    currentIndex: breakpoint2.currentIndex,
    previousTokensSummary,
  });

  if (valueTokens.stop) {
    return {
      updatedIndex: valueTokens.updatedIndex,
      stop: true,
      hasExtends: true,
      completeExtends: false,
    };
  }

  if (!valueTokens.addedNewToken) {
    return {
      updatedIndex: space2?.updatedIndex ?? breakpoint.currentIndex,
      stop: false,
      hasExtends: true,
      completeExtends: false,
    };
  }

  tokens[extendsIndex].type = TokenTypes.EXTENDS;

  return {
    updatedIndex: valueTokens.updatedIndex,
    stop: false,
    hasExtends: true,
    completeExtends: true,
  };
};

type GenericTypeEqualFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const genericTypeEqualFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
}: GenericTypeEqualFlowArgs) => {
  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (breakpoint.newTokenValue !== "=") {
    return {
      updatedIndex: space?.updatedIndex ?? currentIndex,
      stop: false,
      hasEqual: false,
    };
  }

  tokens.push({ type: TokenTypes.EQUAL, value: breakpoint.newTokenValue });

  const valueTokens = valueFlow({
    tokens,
    input,
    newTokenValue: breakpoint.newTokenValue,
    currentIndex,
    previousTokensSummary,
  });

  if (valueTokens.stop) {
    return {
      updatedIndex: valueTokens.updatedIndex,
      stop: true,
      hasEqual: true,
    };
  }

  if (!valueTokens.addedNewToken) {
    return {
      updatedIndex: space?.updatedIndex ?? breakpoint.currentIndex,
      stop: true,
      hasEqual: true,
    };
  }

  return {
    updatedIndex: breakpoint.currentIndex,
    stop: false,
    hasEqual: true,
  };
};

type GenericTypeCommaFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const genericTypeCommaFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
}: GenericTypeCommaFlowArgs) => {
  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (breakpoint.newTokenValue !== ",") {
    return {
      updatedIndex: space?.updatedIndex ?? currentIndex,
      stop: false,
      hasComma: false,
    };
  }

  tokens.push({ type: TokenTypes.COMMA, value: breakpoint.newTokenValue });

  return {
    updatedIndex: breakpoint.currentIndex,
    stop: false,
    hasComma: true,
  };
};
