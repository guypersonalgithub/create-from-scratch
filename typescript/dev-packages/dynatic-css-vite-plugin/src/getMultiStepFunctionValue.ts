import type { DynaticConfiguration } from "@packages/dynatic-css";
import type { DynaticStyleChunksVariable } from "@packages/dynatic-css-typescript-parser";
import { widthMediaQuery } from "@packages/dynatic-css-utils";
import { splitUntilParenthesis } from "@packages/string-utils";
import { getVariableValue } from "./getVariableValue";

type MultiStepFunctionCell = Extract<DynaticStyleChunksVariable, { type: "multi-step-function" }>;
type RegularVariable = Exclude<DynaticStyleChunksVariable, { type: "multi-step-function" }>;

type GetMultiStepFunctionValueArgs = {
  variable: MultiStepFunctionCell;
  updatedConfig?: DynaticConfiguration;
};

const availableFunctions: Record<string, Function> = {
  widthMediaQuery,
};

export const getMultiStepFunctionValue = ({
  variable,
  updatedConfig,
}: GetMultiStepFunctionValueArgs) => {
  const split = splitUntilParenthesis({ str: variable.name });
  const funcName = split[2];

  if (!funcName || !Object.hasOwn(availableFunctions, funcName)) {
    return;
  }

  const callback = availableFunctions[funcName];

  const values: Record<string, unknown> = {};
  const { args } = variable;
  let lastProperty: string;
  let lastPropertyIndex = 0;

  args.forEach((arg, index) => {
    const { type, name } = arg;

    if (type === "property") {
      if (lastPropertyIndex === index - 1) {
        return;
      } else {
        values[name] = undefined;
      }

      lastPropertyIndex = index;
      lastProperty = name;
    } else if (lastProperty && type === "value") {
      values[lastProperty] = name;
    } else if (lastProperty && type === "static-value") {
      if (name.startsWith("'") || name.startsWith('"')) {
        values[lastProperty] = name.slice(1, name.length - 1);
      } else {
        values[lastProperty] = name;
      }
    } else if (lastProperty) {
      const value = getVariableValue({ variable: arg as RegularVariable, updatedConfig });
      values[lastProperty] = value;
    }
  });

  try {
    const result = callback(values);
    return result as string | undefined;
  } catch (error) {
    console.error(error);
  }
};
