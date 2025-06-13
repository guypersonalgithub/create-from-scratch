import { type TokenTypeOptions, TokenTypes } from "../../../constants";
import { type BaseToken } from "../../../types";
import { arrowFlow } from "../../functionFlows";
import { spaceFollowUpFlow } from "../../genericFlows";
import { typeValueFlow } from "../typeValueFlow";

type NoArgumentFunctionTypeFollowupArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const noArgumentFunctionTypeFollowup = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: NoArgumentFunctionTypeFollowupArgs) => {
  tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: newTokenValue });

  const followup = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: currentIndex,
    previousTokensSummary,
  });

  const potentialArrow = arrowFlow({
    tokens,
    input,
    previousTokensSummary,
    ...followup.breakpoint,
  });
  if (!potentialArrow) {
    return {
      updatedIndex: followup.space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  if (potentialArrow.stop) {
    return potentialArrow;
  }

  const potentialReturn = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: potentialArrow.updatedIndex,
    previousTokensSummary,
  });
  const returnType = typeValueFlow({
    tokens,
    input,
    previousTokensSummary,
    ...potentialReturn.breakpoint,
  });

  if (!returnType.addedNewToken || returnType.stop) {
    return {
      updatedIndex: returnType.updatedIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: returnType.updatedIndex,
    stop: false,
  };
};
