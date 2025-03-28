import { TokenTypeOptions, TokenTypes } from "../../../constants";
import { BaseToken } from "../../../types";
import { spaceFollowUpFlow } from "../../genericFlows";
import { functionTypeAdditionalParamsFlow } from "./functionTypeAdditionalParamsFlow";
import { noArgumentFunctionTypeFollowup } from "./noArgumentFunctionTypeFollowup";
import { regularTypeParenthesisFlow } from "./regularTypeParenthesisFlow";
import { typeValueFlow } from "../typeValueFlow";
import { firstTypePotentialArgumentOrValueFlow } from "./firstTypePotentialArgumentOrValueFlow";
import { parenthesisFunctionTypeFlow } from "./parenthesisFunctionTypeFlow";

type ParenthesisTypeFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  expectedToBeAFunction?: boolean;
};

export const parenthesisTypeFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  expectedToBeAFunction,
}: ParenthesisTypeFlowArgs) => {
  if (newTokenValue !== "(") {
    return;
  }

  tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (breakpoint.newTokenValue === "(") {
    if (expectedToBeAFunction) {
      return {
        updatedIndex: space?.updatedIndex ?? currentIndex,
        stop: true,
      };
    }

    return regularTypeParenthesisFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  } else if (breakpoint.newTokenValue === ")") {
    // Empty parenthesis isn't acceptable for types that aren't a function.
    return noArgumentFunctionTypeFollowup({ tokens, input, previousTokensSummary, ...breakpoint });
  }

  let currentSavedIndex = currentIndex;

  const first = firstTypePotentialArgumentOrValueFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });
  if (first.stop !== undefined) {
    return {
      updatedIndex: first.updatedIndex,
      stop: first.stop,
    };
  }

  const { amountOfTokens, skipValidation, firstIndex } = first;
  let { next } = first;
  let hasOptionalArgument = false;

  if (next.breakpoint.newTokenValue === "?") {
    tokens.push({ type: TokenTypes.TYPE_OPTIONAL_ARGUMENT, value: next.breakpoint.newTokenValue });
    hasOptionalArgument = true;
    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: next.breakpoint.currentIndex,
      previousTokensSummary,
    });

    if (followup.breakpoint.newTokenValue !== ":") {
      return {
        updatedIndex: next.breakpoint.currentIndex,
        stop: true,
      };
    }

    next = followup;
  }

  if (next.breakpoint.newTokenValue === ":") {
    if (!skipValidation) {
      const newAmount = tokens.length;

      const acceptableFunctionArgumentTokens = [
        TokenTypes.TYPE,
        TokenTypes.ARRAY_SQUARE_TYPE_BRACKET,
        // TokenTypes.OBJECT_CURLY_TYPE_BRACKET,
        // TokenTypes.OBJECT_COLON,
        TokenTypes.COMMA,
        TokenTypes.WHITESPACE,
        TokenTypes.TYPE_OPTIONAL_ARGUMENT,
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
        hasOptionalArgument,
        ...follow.breakpoint,
      });

      if (endOfParams) {
        if (endOfParams.stop) {
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

    return parenthesisFunctionTypeFlow({
      tokens,
      input,
      previousTokensSummary,
      ...follow.breakpoint,
      space: follow.space,
      previousUpdatedIndex: potentialValue.updatedIndex,
    });
  } else if (next.breakpoint.newTokenValue === ")") {
    tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: next.breakpoint.newTokenValue });

    return {
      updatedIndex: next.breakpoint.currentIndex,
      stop: false,
    };
  }

  return {
    updatedIndex: next.space?.updatedIndex ?? firstIndex,
    stop: true,
  };
};
