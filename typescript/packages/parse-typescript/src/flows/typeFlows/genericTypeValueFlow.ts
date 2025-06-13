import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { extendsTernaryOperatorTypeFlow } from "./extendsTernaryOperatorTypeFlow";
import { typeValueFlow } from "./typeValueFlow";
import { genericTypeCommaFlow } from "./genericTypeCommaFlow";

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

  const values = genericTypeValueFlowContent({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });

  if (values.stop) {
    return values;
  }

  const followup = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: values.updatedIndex,
    previousTokensSummary,
  });

  if (followup.breakpoint.newTokenValue !== ">") {
    return {
      updatedIndex: followup.space?.updatedIndex ?? values.updatedIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.ANGLE, value: followup.breakpoint.newTokenValue });

  return {
    updatedIndex: followup.breakpoint.currentIndex,
    stop: false,
  };
};

type GenericTypeValueContentArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  beyondFirstGeneric?: boolean;
};

type Return = {
  updatedIndex: number;
  stop: boolean;
};

const genericTypeValueFlowContent = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  beyondFirstGeneric,
}: GenericTypeValueContentArgs): Return => {
  const generic = typeValueFlow({
    tokens,
    newTokenValue,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if ((!generic.addedNewToken && !beyondFirstGeneric) || generic.stop) {
    return {
      updatedIndex: generic.updatedIndex,
      stop: true,
    };
  }

  let { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: generic.updatedIndex,
    previousTokensSummary,
  });

  const possibleExtends = extendsTernaryOperatorTypeFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });

  if (possibleExtends) {
    if (possibleExtends.stop) {
      return possibleExtends;
    }

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: possibleExtends.updatedIndex,
      previousTokensSummary,
    });

    breakpoint = followup.breakpoint;
    space = followup.space;
  }

  const potentialComma = genericTypeCommaFlow({ tokens, ...breakpoint });
  let updatedIndex =
    potentialComma?.updatedIndex ??
    space?.updatedIndex ??
    possibleExtends?.updatedIndex ??
    generic.updatedIndex;

  if (potentialComma) {
    const { breakpoint, space } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: potentialComma.updatedIndex,
      previousTokensSummary,
    });
    const followup = genericTypeValueFlowContent({
      tokens,
      input,
      previousTokensSummary,
      beyondFirstGeneric: true,
      ...breakpoint,
    });

    if (followup) {
      if (followup.stop) {
        return followup;
      }

      updatedIndex = followup.updatedIndex;
    }
  }

  return {
    updatedIndex,
    stop: false,
  };
};
