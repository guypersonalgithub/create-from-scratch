import { type TokenTypeOptions, TokenTypes } from "../constants";
import { type BaseToken, type OpenedContext } from "../types";
import { findNextBreakpoint } from "../utils";
import { spaceFollowUpFlow } from "./genericFlows";
import { tokenizerFlows } from "./tokenizerFlows";

type NestedContextFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const nestedContextFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: NestedContextFlowArgs) => {
  const currentContext = openedContexts[openedContexts.length - 1];
  const contextCount = openedContexts.length;

  while (currentIndex < input.length) {
    const { currentIndex: newIndex, newTokenValue } = findNextBreakpoint({ input, currentIndex });

    if (newTokenValue === "}") {
      const type = getAppropriateCurlyBracket({ type: currentContext.type });

      tokens.push({ type, value: newTokenValue });
      openedContexts.pop();

      return {
        updatedIndex: newIndex,
        stop: false,
      };
    }

    const { updatedIndex, addedNewToken } = tokenizerFlows({
      tokens,
      newTokenValue,
      input,
      currentIndex: newIndex,
      previousTokensSummary,
      openedContexts,
      // context,
      // currentLayeredContexts,
    });

    if (addedNewToken && tokens.length <= input.length) {
      currentIndex = updatedIndex;

      const { breakpoint, space } = spaceFollowUpFlow({
        tokens,
        input,
        currentIndex,
        previousTokensSummary,
      });
      if (breakpoint.newTokenValue === "}") {
        const lastContext = openedContexts[openedContexts.length - 1];
        const currentContextCount = openedContexts.length;

        if (
          lastContext.name !== currentContext.name ||
          lastContext.type !== currentContext.type ||
          currentContextCount !== contextCount
        ) {
          return {
            updatedIndex: space?.updatedIndex ?? currentIndex,
            stop: true,
          };
        }

        const type = getAppropriateCurlyBracket({ type: lastContext.type });

        tokens.push({ type, value: breakpoint.newTokenValue });
        currentIndex = breakpoint.currentIndex;

        openedContexts.pop();
        break;
      } else if (space) {
        currentIndex = space.updatedIndex;
      }
    } else {
      return {
        updatedIndex,
        stop: true,
      };
    }
  }

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};

type GetAppropriateCurlyBracketArgs = {
  type: OpenedContext["type"];
};

const getAppropriateCurlyBracket = ({ type }: GetAppropriateCurlyBracketArgs) => {
  const appropriateType: Record<OpenedContext["type"], TokenTypeOptions> = {
    function: TokenTypes.FUNCTION_CURLY_BRACKET,
    class: TokenTypes.CLASS_CURLY_BRACKET,
    if: TokenTypes.IF_CURLY_BRACKET,
  };

  return appropriateType[type];
};
