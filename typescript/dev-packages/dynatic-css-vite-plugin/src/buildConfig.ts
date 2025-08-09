import type { DynaticConfiguration } from "@packages/dynatic-css";
import { parseTypescript } from "@packages/parse-typescript";
import type { BaseToken } from "@packages/parse-typescript/src/types";

type BuildConfigArgs = {
  configString: string;
};

export const buildConfig = ({ configString }: BuildConfigArgs) => {
  const tokens = parseTypescript({ input: configString, skipLog: true });
  const fullConfig: DynaticConfiguration = {};

  recursiveConfigIteration({ fullConfig, tokens, nestingKeys: [] });

  return fullConfig;
};

type RecursiveConfigIteration = {
  fullConfig: DynaticConfiguration;
  tokens: BaseToken[];
  nestingKeys: string[];
  index?: number;
};

const recursiveConfigIteration = ({
  fullConfig,
  tokens,
  nestingKeys,
  index = 0,
}: RecursiveConfigIteration) => {
  for (let i = index; i < tokens.length; i++) {
    const current = tokens[i];

    if (current.type === "object-property" || current.type === "object-string-property") {
      const { value } = current;

      const { currentConfig } = setterHelper({
        fullConfig,
        nestingKeys,
        action: "insert-key",
      });
      currentConfig[value] = {};
      nestingKeys.push(value);

      i = recursiveConfigIteration({
        fullConfig,
        tokens,
        nestingKeys,
        index: i + 1,
      });
    } else if (current.type === "string") {
      const { currentConfig, last } = setterHelper({
        fullConfig,
        nestingKeys,
        action: "insert-value",
      });

      const finalStep = currentConfig as unknown as DynaticConfiguration[string][string];
      const { value } = current;

      finalStep[last] = value.slice(1, value.length - 1);
      nestingKeys.pop();

      return i;
    } else if (current.type === "object-curly-bracket" && current.value === "}") {
      nestingKeys.pop();

      return i;
    }
  }

  return tokens.length - 1;
};

type SetterHelperArgs = {
  fullConfig: DynaticConfiguration;
  nestingKeys: string[];
  action: "insert-key" | "insert-value";
};

// TODO: turn into an overload function
const setterHelper = ({ fullConfig, nestingKeys, action }: SetterHelperArgs) => {
  let currentConfig = fullConfig;

  for (
    let j = 0;
    j < (action === "insert-key" ? nestingKeys.length : nestingKeys.length - 1);
    j++
  ) {
    const currentNestingLevel = nestingKeys[j];
    currentConfig = currentConfig[currentNestingLevel] as unknown as DynaticConfiguration;
  }

  return {
    currentConfig,
    last: nestingKeys[nestingKeys.length - 1],
  };
};
