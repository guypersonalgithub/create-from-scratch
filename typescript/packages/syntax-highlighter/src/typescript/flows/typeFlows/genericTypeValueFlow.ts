import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { spaceFlow, spaceFollowUpFlow } from "../genericFlows";
import { extendsTernaryOperatorTypeFlow } from "./extendsTernaryOperatorTypeFlow";
import { findNextBreakpoint } from "../../utils";
import { typeValueFlow } from "./typeValueFlow";

type GenericTypeValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const genericTypeValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: GenericTypeValueFlowArgs) => {
  if (newTokenValue !== "<") {
    return;
  }

  tokens.push({ type: TokenTypes.ANGLE, value: newTokenValue });

  const { breakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const initial = typeValueFlow({ tokens, input, previousTokensSummary, ...breakpoint });

  if (!initial.addedNewToken || initial.stop) {
    return {
      updatedIndex: initial.updatedIndex,
      stop: true,
    };
  }

  const { breakpoint: followUp, space: followUpSpace } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: initial.updatedIndex,
    previousTokensSummary,
  });

  const possibleExtends = extendsTernaryOperatorTypeFlow({
    tokens,
    input,
    previousTokensSummary,
    ...followUp,
  });

  if (!possibleExtends) {
    if (followUp.newTokenValue !== ">") {
      return {
        updatedIndex: followUpSpace?.updatedIndex ?? initial.updatedIndex,
        stop: true,
      };
    }

    tokens.push({ type: TokenTypes.ANGLE, value: followUp.newTokenValue });

    const following = findNextBreakpoint({ input, currentIndex: followUp.currentIndex });
    const potentialSpace = spaceFlow({ tokens, input, previousTokensSummary, ...following });

    return {
      updatedIndex: potentialSpace?.updatedIndex ?? followUp.currentIndex,
      stop: false,
    };
  }

  if (possibleExtends.stop) {
    return possibleExtends;
  }

  const { breakpoint: followUp2, space: followUpSpace2 } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: possibleExtends.updatedIndex,
    previousTokensSummary,
  });

  if (followUp2.newTokenValue !== ">") {
    return {
      updatedIndex: followUpSpace2?.updatedIndex ?? possibleExtends.updatedIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.ANGLE, value: followUp2.newTokenValue });

  return {
    updatedIndex: followUp2.currentIndex,
    stop: false,
  };
};
