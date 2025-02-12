import { isStringOnlyWithLetters } from "@packages/utils";
import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { extendsFlow, genericTypeCommaFlow, genericTypeEqualFlow } from "./genericTypeUtils";
import { spaceFollowUpFlow } from "./spaceFlow";

type GenericTypeFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  propertyIndex: number;
};

export const genericTypeFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  propertyIndex,
}: GenericTypeFlowArgs) => {
  const { updatedIndex, stop, potentialExtends, potentialEqual, potentialComma } =
    singleExtendsFlow({ tokens, input, currentIndex, previousTokensSummary, isFirst: true });

  if (stop) {
    return {
      updatedIndex,
      stop,
    };
  }

  const hasExtends = potentialExtends?.completeExtends;
  const hasEqual = potentialEqual?.hasEqual;
  const hasComma = potentialComma?.hasComma;
  const isType = hasExtends || hasEqual || hasComma;

  if (isType) {
    tokens[propertyIndex].type = TokenTypes.TYPE;
  }

  if (hasComma) {
    currentIndex = potentialComma.updatedIndex;

    while (currentIndex < input.length && input[currentIndex] !== ">") {
      const { breakpoint } = spaceFollowUpFlow({
        tokens,
        input,
        currentIndex,
        previousTokensSummary,
      });

      if (
        !isStringOnlyWithLetters({ str: breakpoint.newTokenValue }) ||
        breakpoint.newTokenValue[0] !== "_"
      ) {
        return {
          updatedIndex: currentIndex,
          stop: true,
        };
      }

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

      if (!potentialComma?.hasComma) {
        break;
      }
    }

    currentIndex = potentialComma.updatedIndex ?? updatedIndex;
  } else if (hasEqual) {
    currentIndex = potentialEqual.updatedIndex;
  } else if (hasExtends) {
    currentIndex = potentialExtends.updatedIndex;
  }

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
};

const singleExtendsFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  isFirst,
}: SingleExtendsFlowArgs) => {
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
      // return tagFlow
      return {
        updatedIndex: potentialExtends.updatedIndex,
        stop: false,
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

  return {
    potentialExtends,
    potentialEqual,
    potentialComma,
  };
};
