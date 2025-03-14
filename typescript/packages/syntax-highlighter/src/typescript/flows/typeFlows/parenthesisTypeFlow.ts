import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { arrowFlow } from "../arrowFlow";
import { spaceFollowUpFlow } from "../spaceFlow";
import { functionTypeAdditionalParamsFlow } from "./functionTypeAdditionalParamsFlow";
import { regularTypeParenthesisFlow } from "./regularTypeParenthesisFlow";
import { typeValueFlow } from "./typeValueFlow";

type ParenthesisTypeFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const parenthesisTypeFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ParenthesisTypeFlowArgs) => {
  if (newTokenValue !== "(") {
    return;
  }

  tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: newTokenValue });

  const { breakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (breakpoint.newTokenValue === "(") {
    return regularTypeParenthesisFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  } else if (breakpoint.newTokenValue === ")") {
    tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: breakpoint.newTokenValue });

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: breakpoint.currentIndex,
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
        updatedIndex: followup.space?.updatedIndex ?? breakpoint.currentIndex,
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
  }

  const amountOfTokens = tokens.length;
  let currentSavedIndex = breakpoint.currentIndex;
  const potentialType = typeValueFlow({ tokens, input, previousTokensSummary, ...breakpoint });

  if (!potentialType.addedNewToken || potentialType.stop) {
    return {
      updatedIndex: potentialType.updatedIndex,
      stop: true,
    };
  }

  if (potentialType.addedAndOr) {
    const { breakpoint } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: potentialType.updatedIndex,
      previousTokensSummary,
    });
    return regularTypeParenthesisFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  }

  const next = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: potentialType.updatedIndex,
    previousTokensSummary,
  });
  if (next.breakpoint.newTokenValue === ":") {
    const newAmount = tokens.length;

    const acceptableFunctionArgumentTokens = [
      TokenTypes.TYPE,
      TokenTypes.ARRAY_SQUARE_TYPE_BRACKET,
      TokenTypes.OBJECT_CURLY_TYPE_BRACKET,
      TokenTypes.OBJECT_COLON,
      TokenTypes.COMMA,
      TokenTypes.WHITESPACE,
    ];

    const acceptable = new Set<TokenTypeOptions>(acceptableFunctionArgumentTokens);

    for (let i = amountOfTokens; i < newAmount; i++) {
      if (tokens[i].type === TokenTypes.TYPE) {
        tokens[i].type = TokenTypes.VARIABLE;
        currentSavedIndex += tokens[i].value.length;
      } else if (acceptable.has(tokens[i].type)) {
        currentSavedIndex += tokens[i].value.length;
      } else {
        tokens = tokens.slice(0, i + 1);

        return {
          updatedIndex: currentSavedIndex,
          stop: true,
        };
      }
    }

    tokens.push({ type: TokenTypes.TYPE_COLON, value: next.breakpoint.newTokenValue });

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: next.breakpoint.currentIndex,
      previousTokensSummary,
    });
    const potentialValue = typeValueFlow({
      tokens,
      input,
      previousTokensSummary,
      ...followup.breakpoint,
    });

    if (!potentialValue.addedNewToken || potentialValue.stop) {
      return {
        updatedIndex: potentialValue.updatedIndex,
        stop: true,
      };
    }

    let follow = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: potentialValue.updatedIndex,
      previousTokensSummary,
    });
    if (follow.breakpoint.newTokenValue === ",") {
      const endOfParams = functionTypeAdditionalParamsFlow({
        tokens,
        input,
        previousTokensSummary,
        ...follow.breakpoint,
      });

      if (endOfParams) {
        if(endOfParams.stop) {
          return endOfParams;
        }

        const beyond = spaceFollowUpFlow({
          tokens,
          input,
          currentIndex: endOfParams.updatedIndex,
          previousTokensSummary,
        });
        follow.breakpoint = beyond.breakpoint;
      }
    }

    if (follow.breakpoint.newTokenValue !== ")") {
      return {
        updatedIndex: follow.space?.updatedIndex ?? potentialValue.updatedIndex,
        stop: true,
      };
    }

    tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: follow.breakpoint.newTokenValue });

    const nextInLine = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: follow.breakpoint.currentIndex,
      previousTokensSummary,
    });
    const potentialArrow = arrowFlow({
      tokens,
      input,
      previousTokensSummary,
      ...nextInLine.breakpoint,
    });

    if (!potentialArrow) {
      return {
        updatedIndex: nextInLine.space?.updatedIndex ?? follow.breakpoint.currentIndex,
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
  } else if (next.breakpoint.newTokenValue === ")") {
    tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: next.breakpoint.newTokenValue });

    return {
      updatedIndex: next.breakpoint.currentIndex,
      stop: false,
    };
  }

  return {
    updatedIndex: next.space?.updatedIndex ?? potentialType.updatedIndex,
    stop: true,
  };
};
