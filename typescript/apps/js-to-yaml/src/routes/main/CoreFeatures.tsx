import { TypescriptTokenTypes } from "@packages/parse-typescript";
import { StyledCard, StyledList, StyledSyntaxHighlighter } from "../../customizedComponents";
import { OpenBook } from "@packages/icons";
import { dynatic } from "../../dynatic-css.config";

type CoreFeaturesProps = {
  isDesktop: boolean;
};

export const CoreFeatures = ({ isDesktop }: CoreFeaturesProps) => {
  return (
    <StyledCard
      className={dynatic`
        border: 1px solid ${(config) => config.colors.defaultBorder};
      `}
      style={{
        width: isDesktop ? "50vw" : "calc(90vw - 30px)",
      }}
    >
      <div
        className={dynatic`
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 20px;
        `}
      >
        <OpenBook
          style={{
            width: "24px",
            height: "24px",
            color: "rgba(0, 119, 184, 0.976)",
            marginTop: "6px",
          }}
        />
        <span
          className={dynatic`
            font-weight: bold;
            font-size: 25px;
          `}
        >
          Core features
        </span>
      </div>
      <StyledList
        list={[
          {
            icon: (
              <div
                className={dynatic`
                  font-size: 12px;
                  font-weight: bolder;
                `}
              >
                YAML
              </div>
              // <YAML
              //   width={30}
              //   style={{
              //     color: "var(--theme-color)",
              //     transition: "var(--theme-transition)",
              //   }}
              // />
            ),
            title: "Convert Javascript objects to YAML formatted strings",
            subTitle:
              "Pass a Javascript object as an argument and receive a formatted YAML string, ready to be saved as a file",
            example: (
              <StyledSyntaxHighlighter
                code={`import { convertObjectToYaml } from "js-to-yaml";

const testsConfig = {
name: "Tests",
on: {
pull_request: {
branches: ["main"],
types: ["opened", "synchronize", "reopened"],
},
},
jobs: {
"Tests": {
"runs-on": "ubuntu-latest",
steps: [
  {
    name: "Install dependencies",
    run: "npm i",
  },
  {
    name: "Run tests",
    run: "npm run test",
  },
],
},
},
}

const output = convertObjectToYaml({ obj: testsConfig });
`}
                highlightCode
                customizeColors={() => {
                  return {
                    cellTypeRebranding: {
                      4: TypescriptTokenTypes.FUNCTION_NAME,
                    },
                  };
                }}
              />
            ),
          },
          {
            icon: (
              <div
                className={dynatic`
                  font-size: 14px;
                  font-weight: bolder;
                `}
              >
                JS
              </div>
              // <Javascript
              //   width={30}
              //   style={{
              //     color: "var(--theme-color)",
              //     transition: "var(--theme-transition)",
              //   }}
              //   fill="currentColor"
              // />
            ),
            title: "Convert YAML strings to a Javascript Object",
            subTitle: "Pass a YAML string as an argument and receive a Javascript Object",
            example: (
              <StyledSyntaxHighlighter
                code={`import { convertYamlToObject } from "js-to-yaml";
import { readFileSync } from "fs";

const yaml = readFileSync("./file.yaml"); // Assuming file.yaml is a real YAML file
const output = convertYamlToObject({ str: yaml });
`}
                highlightCode
                customizeColors={() => {
                  return {
                    cellTypeRebranding: {
                      4: TypescriptTokenTypes.FUNCTION_NAME,
                      17: TypescriptTokenTypes.FUNCTION_NAME,
                    },
                  };
                }}
              />
            ),
          },
        ]}
      />
    </StyledCard>
  );
};
