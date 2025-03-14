import { TokenTypeOptions, TokenTypes } from "./constants";
import { tokenizerFlows } from "./flows/tokenizerFlows";
import { BaseToken, OpenedContext } from "./types";

type ParseTypescriptArgs = {
  input: string;
};

export const parseTypescript = ({ input }: ParseTypescriptArgs) => {
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
      const { updatedIndex, addedNewToken } = tokenizerFlows({
        tokens,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
        // context,
        // currentLayeredContexts,
      });

      if (addedNewToken && tokens.length <= input.length) {
        currentIndex = updatedIndex;
      } else {
        const stoppedAt = input.slice(updatedIndex);
        console.log(`Stopped at: ${stoppedAt}`);
        tokens.push({ type: TokenTypes.UNKNOWN, value: stoppedAt });
        console.error(
          `Encountered unsupported character ${stoppedAt.charAt(0)} on index ${updatedIndex}.`,
        );
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return tokens;
};
