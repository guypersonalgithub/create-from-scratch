import { convertObjectToYaml, convertYamlToObject } from "@packages/yaml";
import { convertObjectToString } from "@packages/object-utils";

export const javascript = {
  property: {
    property2: "value",
  },
  property3: 2,
  deep: {
    nested: {
      value: ["1", "2"],
    },
  },
};

export const stringifiedObject = convertObjectToString({ obj: javascript });

export const output = convertObjectToYaml({ obj: javascript });

export const yaml = `property:
  property2: value
property3: 2
deep:
  nested:
    value:
      - 1
      - 2
`;

export const javascriptOutput = convertObjectToString({ obj: convertYamlToObject({ str: yaml }) });
