import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { genericTypeDefinitionExtendsFlow } from "./genericTypeDefinitionExtendsFlow";
import { genericTypeEqualFlow } from "./genericTypeEqualFlow";
import { genericTypeCommaFlow } from "./genericTypeCommaFlow";
import { typeValueFlow } from "./typeValueFlow";

type GenericTypeTemplateFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const genericTypeTemplateFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: GenericTypeTemplateFlowArgs) => {
  if (newTokenValue !== "<") {
    return;
  }

  tokens.push({ type: TokenTypes.ANGLE, value: newTokenValue });

  const types = genericTypeTemplateFlowVariable({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
    isFirst: true,
  });
  if (types.stop) {
    return types;
  }

  const { breakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: types.updatedIndex,
    previousTokensSummary,
  });

  tokens.push({ type: TokenTypes.ANGLE, value: breakpoint.newTokenValue });

  return {
    updatedIndex: breakpoint.currentIndex,
    stop: false,
  };
};

type GenericTypeTemplateFlowVariableArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  isFirst?: boolean;
};

export const genericTypeTemplateFlowVariable = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  isFirst,
}: GenericTypeTemplateFlowVariableArgs): {
  updatedIndex: number;
  stop: boolean;
} => {
  const initial = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const type = typeValueFlow({ tokens, input, previousTokensSummary, ...initial.breakpoint });

  if (!type) {
    return {
      updatedIndex: initial.space?.updatedIndex ?? currentIndex,
      stop: !!isFirst,
    };
  }

  if (type.stop) {
    return type;
  }

  currentIndex = type.updatedIndex;

  let { breakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const possibleExtends = genericTypeDefinitionExtendsFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });

  if (possibleExtends) {
    if (possibleExtends.stop) {
      return possibleExtends;
    }

    currentIndex = possibleExtends.updatedIndex;
    breakpoint = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex,
      previousTokensSummary,
    }).breakpoint;
  }

  const possibleEqual = genericTypeEqualFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });

  if (possibleEqual) {
    if (possibleEqual.stop) {
      return possibleEqual;
    }

    currentIndex = possibleEqual.updatedIndex;
    breakpoint = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex,
      previousTokensSummary,
    }).breakpoint;
  }

  const possibleComma = genericTypeCommaFlow({ tokens, ...breakpoint });

  if (possibleComma) {
    currentIndex = possibleComma.updatedIndex;

    const additionalVariable = genericTypeTemplateFlowVariable({
      tokens,
      input,
      currentIndex,
      previousTokensSummary,
      isFirst: false,
    });
    currentIndex = additionalVariable.updatedIndex;
  }

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
