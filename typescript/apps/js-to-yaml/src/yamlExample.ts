import { convertObjectToYaml, convertYamlToObject } from "@packages/yaml";

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

export const javascriptOutput = convertYamlToObject({ str: yaml });
