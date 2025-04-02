import { TokenTypeOptions } from "../../../constants";
import { BaseToken } from "../../../types";
import { spaceFollowUpFlow } from "../../genericFlows";
import { variableOnlyValueFlow } from "../../variableOnlyValueFlow";
import { typeValueFlow } from "../typeValueFlow";
import { regularTypeParenthesisFlow } from "./regularTypeParenthesisFlow";

type FirstTypePotentialArgumentOrValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  expectedToBeAFunction?: boolean;
};

type Return =
  | {
      updatedIndex: number;
      stop: boolean;
      amountOfTokens?: undefined;
      skipValidation?: undefined;
      firstIndex?: undefined;
      next?: undefined;
    }
  | {
      amountOfTokens: number;
      skipValidation: boolean;
      next: ReturnType<typeof spaceFollowUpFlow>;
      firstIndex: number;
      updatedIndex?: undefined;
      stop?: undefined;
    };

export const firstTypePotentialArgumentOrValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  expectedToBeAFunction,
}: FirstTypePotentialArgumentOrValueFlowArgs): Return => {
  const amountOfTokens = tokens.length;
  let skipValidation = false;
  let cachedTokens: BaseToken[] = [];
  let potentialType: {
    updatedIndex: number;
    stop: boolean;
    missingTypeInObject?: boolean;
    addedNewToken?: boolean;
    addedAndOr?: boolean;
  } = typeValueFlow({ tokens, input, currentIndex, previousTokensSummary, newTokenValue });

  if (potentialType.missingTypeInObject) {
    const newAmount = tokens.length;
    cachedTokens = tokens.splice(amountOfTokens);
    const potentialValue = variableOnlyValueFlow({
      tokens,
      input,
      previousTokensSummary,
      currentIndex,
      newTokenValue,
    });

    if (!potentialValue.addedNewToken || potentialValue.stop) {
      tokens.splice(amountOfTokens);
      tokens.push(...cachedTokens);
      return {
        updatedIndex: potentialType.updatedIndex,
        stop: true,
      };
    }

    potentialType.updatedIndex = potentialValue.updatedIndex;
    potentialType.stop = potentialValue.stop;
    potentialType.addedNewToken = potentialValue.addedNewToken;
    potentialType.addedAndOr = undefined;
    skipValidation = true;
    cachedTokens.push(...tokens.slice(newAmount));
  }

  if (!potentialType.addedNewToken || potentialType.stop) {
    return {
      updatedIndex: potentialType.updatedIndex,
      stop: true,
    };
  }

  if (potentialType.addedAndOr) {
    if (expectedToBeAFunction) {
      return {
        updatedIndex: potentialType.updatedIndex,
        stop: true,
      };
    }

    const { breakpoint } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: potentialType.updatedIndex,
      previousTokensSummary,
    });
    return regularTypeParenthesisFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  }

  let next = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: potentialType.updatedIndex,
    previousTokensSummary,
  });

  if (
    potentialType.missingTypeInObject &&
    next.breakpoint.newTokenValue !== "?" &&
    next.breakpoint.newTokenValue !== ":"
  ) {
    tokens.splice(amountOfTokens);
    tokens.push(...cachedTokens);
    return {
      updatedIndex: next.space?.updatedIndex ?? potentialType.updatedIndex,
      stop: true,
    };
  }

  return {
    amountOfTokens,
    skipValidation,
    firstIndex: potentialType.updatedIndex,
    next,
  };
};
