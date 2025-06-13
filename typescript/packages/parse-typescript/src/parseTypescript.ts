import { type TokenTypeOptions, TokenTypes } from "./constants";
import { tokenizerFlows } from "./flows/tokenizerFlows";
import { type BaseToken, type OpenedContext } from "./types";
import { findNextBreakpoint } from "./utils";

type ParseTypescriptArgs = {
  input: string;
  skipLog?: boolean;
};

export const parseTypescript = ({ input, skipLog }: ParseTypescriptArgs) => {
  const tokens: BaseToken[] = [];
  const previousTokensSummary: TokenTypeOptions[] = [];
  const openedContexts: OpenedContext[] = [];
  let currentIndex = 0;
  // const context: Context = {
  //   global: { variables: new Set<string>(), functions: new Set<string>() },
  // };
  // const currentLayeredContexts: CurrentLayeredContexts = [];

  try {
    while (currentIndex < input.length) {
      const { currentIndex: newIndex, newTokenValue } = findNextBreakpoint({ input, currentIndex });
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
      } else {
        const stoppedAt = input.slice(updatedIndex);
        if (!skipLog) {
          console.log(`Stopped at: ${stoppedAt}`);
        }
        tokens.push({ type: TokenTypes.UNKNOWN, value: stoppedAt });
        if (!skipLog) {
          console.error(
            `Encountered unsupported character ${stoppedAt.charAt(0)} on index ${updatedIndex}.`,
          );
        }
        break;
      }
    }
  } catch (error) {
    if (!skipLog) {
      console.error(error);
    }
  }

  return tokens;
};
