import type { DynaticConfiguration } from "@packages/dynatic-css";
import type { DynaticStyleChunksVariable } from "@packages/dynatic-css-typescript-parser";
import { stripQuotationMarks } from "./stripQuotationMarks";

type GetVariableValueArgs = {
  variable: DynaticStyleChunksVariable;
  updatedConfig?: DynaticConfiguration;
};

export const getVariableValue = ({ variable, updatedConfig }: GetVariableValueArgs) => {
  if (variable.type === "nested-variable") {
    return stripQuotationMarks({ str: variable.name });
  }

  const split = variable.name.split(".").slice(1);
  let selectedValue = getInitialSelectedValue({ updatedConfig, split });

  split.forEach((part) => {
    selectedValue = selectedValue[part] as Record<string, unknown>;
  });

  if (typeof selectedValue === "string" || typeof selectedValue === "number") {
    return selectedValue;
  }

  return;
};

type GetInitialSelectedValueArgs = {
  updatedConfig?: DynaticConfiguration;
  split: string[];
};

const getInitialSelectedValue = ({ updatedConfig, split }: GetInitialSelectedValueArgs) => {
  const config = updatedConfig?.variants ?? {};
  const firstKey = getFirstKey({ updatedConfig: config });
  if (firstKey && config[firstKey]?.[split[0]]) {
    return config[firstKey] as Record<string, unknown>;
  }

  return updatedConfig as Record<string, unknown>;
};

type GetFirstKeyArgs = {
  updatedConfig: DynaticConfiguration["variants"];
};

const getFirstKey = ({ updatedConfig }: GetFirstKeyArgs) => {
  for (const key in updatedConfig) {
    return key;
  }
};
