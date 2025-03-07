import { getNextNonSpaceCharIndex } from "@packages/utils";
import { BaseToken, OpenedContextsIdentation } from "./types";
import { tokenizerFlows } from "./flows/tokenizerFlows";
import { TokenTypes } from "./constants";

type parseYamlArgs = {
  input: string;
};

export const parseYaml = ({ input }: parseYamlArgs) => {
  const tokens: BaseToken[] = [];
  const { skippedIndexes = 0 } = getNextNonSpaceCharIndex({ input });

  let currentIndex = 0;
  const identations = {
    lowestIdentation: skippedIndexes,
    currentIdentation: 0,
  };
  const openedContextsIdentations: OpenedContextsIdentation[] = [];

  while (currentIndex < input.length) {
    const { updatedIndex, addedNewToken } = tokenizerFlows({
      tokens,
      input,
      currentIndex,
      identations,
      openedContextsIdentations,
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

  return tokens;
};
