import { isStringOnlyWithLetters } from "@packages/utils";
import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken, OpenedContext } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { JSXFlow } from "../JSXFlow";
import { ambiguousExtendsFlow } from "./ambiguousExtendsFlow";
import { genericTypeEqualFlow, genericTypeCommaFlow } from "../typeFlows";

type AmbiguousTagFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  propertyIndex?: number;
  isExpectedToBeType?: boolean;
};

export const ambiguousTagFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  propertyIndex,
  isExpectedToBeType,
}: AmbiguousTagFlowArgs) => {
  const { updatedIndex, stop, isJSX, potentialExtends, hasEqual, hasComma } = singleExtendsFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
    openedContexts,
    isFirst: true,
    isExpectedToBeType,
  });

  if (stop) {
    return {
      updatedIndex,
      stop,
    };
  }

  if (isJSX) {
    return {
      updatedIndex,
      stop,
      isJSX,
    };
  }

  const hasExtends = potentialExtends?.completeExtends;
  const isType = hasExtends || hasEqual || hasComma;
  currentIndex = updatedIndex;

  if (isType && propertyIndex !== undefined) {
    tokens[propertyIndex].type = TokenTypes.TYPE;
  }

  if (hasComma) {
    // currentIndex = potentialComma.updatedIndex;

    while (currentIndex < input.length && input[currentIndex] !== ">") {
      const { breakpoint, space } = spaceFollowUpFlow({
        tokens,
        input,
        currentIndex,
        previousTokensSummary,
      });

      if (breakpoint.newTokenValue === ">") {
        currentIndex = space?.updatedIndex ?? currentIndex;
        break;
      } else if (
        !isStringOnlyWithLetters({ str: breakpoint.newTokenValue.charAt(0) }) &&
        breakpoint.newTokenValue[0] !== "_"
      ) {
        return {
          updatedIndex: space?.updatedIndex ?? currentIndex,
          stop: true,
        };
      }

      tokens.push({ type: TokenTypes.TYPE, value: breakpoint.newTokenValue });

      const { updatedIndex, stop, hasComma } = singleExtendsFlow({
        tokens,
        input,
        currentIndex: breakpoint.currentIndex,
        previousTokensSummary,
        openedContexts,
      });

      if (stop) {
        return {
          updatedIndex,
          stop,
        };
      }

      currentIndex = updatedIndex;

      if (!hasComma) {
        break;
      }
    }
  }

  //   currentIndex = potentialComma.updatedIndex ?? updatedIndex;
  // } else if (hasEqual) {
  //   currentIndex = potentialEqual.updatedIndex;
  // } else if (hasExtends) {
  //   currentIndex = potentialExtends.updatedIndex;
  // }

  return {
    updatedIndex: currentIndex,
    stop: false,
    isType,
  };
};

type SingleExtendsFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  isFirst?: boolean;
  isExpectedToBeType?: boolean;
};

const singleExtendsFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  isFirst,
  isExpectedToBeType,
}: SingleExtendsFlowArgs): {
  isJSX?: boolean;
  updatedIndex: number;
  stop?: boolean;
  potentialExtends?: ReturnType<typeof ambiguousExtendsFlow>;
  hasEqual?: boolean;
  hasComma?: boolean;
} => {
  const potentialExtends = ambiguousExtendsFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (potentialExtends.stop) {
    return {
      updatedIndex: potentialExtends.updatedIndex,
      stop: true,
    };
  }

  if (potentialExtends.hasExtends && !potentialExtends.completeExtends) {
    if (isFirst) {
      if (isExpectedToBeType) {
        return {
          updatedIndex: potentialExtends.updatedIndex,
          stop: true,
        };
      }

      const jsx = JSXFlow({
        tokens,
        input,
        currentIndex: potentialExtends.updatedIndex,
        previousTokensSummary,
        openedContexts,
      });

      return {
        ...jsx,
        isJSX: true,
      };
    }

    return {
      updatedIndex: potentialExtends.updatedIndex,
      stop: true,
    };
  }

  currentIndex = potentialExtends.updatedIndex;

  let { breakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const potentialEqual = genericTypeEqualFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });

  if (potentialEqual?.stop) {
    return {
      updatedIndex: potentialEqual.updatedIndex,
      stop: true,
    };
  }

  if (potentialEqual) {
    currentIndex = potentialEqual.updatedIndex;

    breakpoint = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex,
      previousTokensSummary,
    }).breakpoint;
  }

  const potentialComma = genericTypeCommaFlow({
    tokens,
    ...breakpoint,
  });

  if (potentialComma) {
    currentIndex = potentialComma.updatedIndex;
  }

  return {
    updatedIndex: currentIndex,
    potentialExtends,
    hasEqual: !!potentialEqual,
    hasComma: !!potentialComma,
  };
};
