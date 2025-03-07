import { isStringOnlyWithLetters } from "@packages/utils";
import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { extendsFlow, genericTypeCommaFlow, genericTypeEqualFlow } from "./genericTypeUtils";
import { spaceFollowUpFlow } from "./spaceFlow";
import { JSXFlow } from "./JSXFlow";

type GenericTypeFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  propertyIndex?: number;
  isExpectedToBeType?: boolean;
};

export const genericTypeFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  propertyIndex,
  isExpectedToBeType,
}: GenericTypeFlowArgs) => {
  const { updatedIndex, stop, isJSX, potentialExtends, potentialEqual, potentialComma } =
    singleExtendsFlow({
      tokens,
      input,
      currentIndex,
      previousTokensSummary,
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
  const hasEqual = potentialEqual?.hasEqual;
  const hasComma = potentialComma?.hasComma;
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
        !isStringOnlyWithLetters({ str: breakpoint.newTokenValue }) &&
        breakpoint.newTokenValue[0] !== "_"
      ) {
        return {
          updatedIndex: currentIndex,
          stop: true,
        };
      }

      tokens.push({ type: TokenTypes.TYPE, value: breakpoint.newTokenValue });

      const { updatedIndex, stop, potentialComma } = singleExtendsFlow({
        tokens,
        input,
        currentIndex: breakpoint.currentIndex,
        previousTokensSummary,
      });

      if (stop) {
        return {
          updatedIndex,
          stop,
        };
      }

      currentIndex = updatedIndex;

      if (!potentialComma?.hasComma) {
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
  isFirst?: boolean;
  isExpectedToBeType?: boolean;
};

const singleExtendsFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  isFirst,
  isExpectedToBeType,
}: SingleExtendsFlowArgs): {
  isJSX?: boolean;
  updatedIndex: number;
  stop?: boolean;
  potentialExtends?: ReturnType<typeof extendsFlow>;
  potentialEqual?: ReturnType<typeof genericTypeEqualFlow>;
  potentialComma?: ReturnType<typeof genericTypeCommaFlow>;
} => {
  const potentialExtends = extendsFlow({
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

  const potentialEqual = genericTypeEqualFlow({
    tokens,
    input,
    currentIndex: potentialExtends.updatedIndex,
    previousTokensSummary,
  });

  if (potentialEqual.stop) {
    return {
      updatedIndex: potentialEqual.updatedIndex,
      stop: true,
    };
  }

  const potentialComma = genericTypeCommaFlow({
    tokens,
    input,
    currentIndex: potentialEqual.updatedIndex,
    previousTokensSummary,
  });

  const updatedIndex = Math.max(
    currentIndex,
    potentialExtends.updatedIndex,
    potentialEqual.updatedIndex,
    potentialComma.updatedIndex,
  );

  return {
    updatedIndex,
    potentialExtends,
    potentialEqual,
    potentialComma,
  };
};
