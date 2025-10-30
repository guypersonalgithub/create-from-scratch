import type { DynaticConfiguration } from "@packages/dynatic-css";
import { hashString } from "@packages/dynatic-css-utils";
import { detectObjectEnd } from "@packages/dynatic-css-typescript-parser";
import { buildConfig } from "./buildConfig";

type GenerateConfigCSSArgs = {
  fileText: string;
};

export const generateConfigCSS = ({ fileText }: GenerateConfigCSSArgs) => {
  const configIdentifier = "const config = {";
  const startIndexConfig = fileText.indexOf(configIdentifier);
  const updatedStart = startIndexConfig + configIdentifier.length - 1;
  const { endIndex } = detectObjectEnd({
    input: fileText,
    startIndex: updatedStart + 1,
  });

  const configString = fileText.slice(updatedStart, endIndex);
  const config = buildConfig({ configString });
  const { configCSS, updatedConfig } = convertConfigToCSSVariables({ config });

  return { configCSS, updatedConfig, configObjectStartIndex: updatedStart };
};

type ConvertConfigToCSSVariablesArgs = {
  config: DynaticConfiguration;
};

export const convertConfigToCSSVariables = ({ config }: ConvertConfigToCSSVariablesArgs) => {
  let configCSS = "";

  const { variants, ...rest } = config;

  const updatedConfig: DynaticConfiguration = { variants: {}, ...rest };

  for (const variant in variants) {
    const type = variants[variant];
    updatedConfig.variants[variant] = {};

    let variantString = `body.${variant} {\n`;

    for (const propertiesID in type) {
      const properties = type[propertiesID];
      updatedConfig.variants[variant][propertiesID] = {};

      for (const property in properties) {
        const value = properties[property];
        const fullKey = `config.${propertiesID}.${property}`;
        const hash = hashString({ input: fullKey });
        const hashKey = `--${hash}`;
        updatedConfig.variants[variant][propertiesID][property] = `var(${hashKey})`;
        variantString += `  ${hashKey}: ${value};\n`;
      }
    }

    variantString += "}\n";
    configCSS += variantString;
  }

  return { configCSS, updatedConfig };
};
