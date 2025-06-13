import { type TokenTypeOptions } from "../../constants";
import { type BaseToken, type TypeFlowCallback } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { stringFlow, templateLiteralFlow } from "../stringFlows";
import { arrayTypeFlow } from "./arrayTypeFlow";
import { keyofFlow } from "./keyofFlow";
import { objectTypeFlow } from "./objectTypeFlow";
import { parenthesisTypeFlow } from "./parenthesisTypeFlows";
import { genericTypeFunctionTypeFlow } from "./parenthesisTypeFlows/genericTypeFunctionTypeFlow";
import { typeAndOrFlow } from "./typeAndOrFlow";
import { typeAndOrFollowupFlow } from "./typeAndOrFollowupFlow";
import { typeFlow } from "./typeFlow";
import { typeofFlow } from "./typeofFlow";

type TypeValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  isKeyof?: boolean;
  isAsFlow?: boolean;
};

export const typeValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  isKeyof,
  isAsFlow,
}: TypeValueFlowArgs) => {
  const callbacks: TypeFlowCallback[] = [
    () =>
      stringFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        isType: true,
      }),
    () =>
      templateLiteralFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        isType: true,
      }),
    () =>
      genericTypeFunctionTypeFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
      }),
    () =>
      parenthesisTypeFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () => objectTypeFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () => arrayTypeFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () => typeofFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () => keyofFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () => typeAndOrFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () => typeFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
  ];

  if (isKeyof) {
    callbacks.splice(-2, 1);
  }

  for (let i = 0; i < callbacks.length; i++) {
    const current = callbacks[i];
    const response = current();
    if (!response) {
      continue;
    }

    const { updatedIndex: newIndex, stop, missingTypeInObject } = response;
    if (stop) {
      return {
        updatedIndex: newIndex,
        stop: true,
        missingTypeInObject,
      };
    }

    if (!isKeyof && i !== callbacks.length - 2) {
      const { breakpoint, space } = spaceFollowUpFlow({
        tokens,
        input,
        currentIndex: newIndex,
        previousTokensSummary,
      });

      const andOrType = typeAndOrFollowupFlow({
        tokens,
        input,
        previousTokensSummary,
        isAsFlow,
        ...breakpoint,
      });

      if (!andOrType) {
        return {
          updatedIndex: space?.updatedIndex ?? newIndex,
          stop: false,
          addedNewToken: true,
        };
      }

      if (andOrType.stop) {
        return {
          updatedIndex: space?.updatedIndex ?? newIndex,
          stop: true,
          addedNewToken: true,
          addedAndOr: true,
        };
      }

      return {
        updatedIndex: andOrType.updatedIndex,
        stop: false,
        addedNewToken: true,
        addedAndOr: true,
      };
    }

    return {
      updatedIndex: newIndex,
      stop: false,
      addedNewToken: true,
    };
  }

  return {
    updatedIndex: currentIndex - newTokenValue.length,
    stop: false,
    addedNewToken: false,
  };
};
