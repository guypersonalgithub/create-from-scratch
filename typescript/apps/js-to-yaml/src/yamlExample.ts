import { convertObjectToYaml, convertYamlToObject } from "@packages/yaml";
import { convertObjectToString } from "@packages/object-utils";

export const javascript = {
  property: {
    property2: "value",
  },
  property3: 2,
  deep: {
    nested: {
      value: {
        a: [1, 2],
      },
    },
  },
};

export const stringifiedObject = convertObjectToString({ obj: javascript, stringifyValues: true });
export const output = convertObjectToYaml({ obj: javascript });
export const javascriptOutput = convertObjectToString({
  obj: convertYamlToObject({ str: output }),
  stringifyValues: true,
});
