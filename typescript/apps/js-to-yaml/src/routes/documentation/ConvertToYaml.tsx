import { TypescriptTokenTypes } from "@packages/parse-typescript";
import { APITable, StyledCard } from "../../styledComponents";
import { StyledTitle, StyledSubTitle } from "../../styledComponents/StyledTitle";
import { SyntaxHighlighter } from "@packages/syntax-highlighter";
import { useUpdateAnchors } from "../../useUpdateAnchors";

export const ConvertToYaml = () => {
  const { registerRef } = useUpdateAnchors();

  return (
    <StyledCard>
      <StyledTitle>Convert to YAML</StyledTitle>
      <div>Javascript convertion to a YAML format is as simple as it can get.</div>
      <div>
        Import the convertObjectToYaml function, pass in the desired object, and then if desired,
        save in the output in a .yaml file:
      </div>
      <SyntaxHighlighter
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
      <div ref={(ref) => registerRef({ ref, content: "Supported inputs" })}>
        <StyledSubTitle>Supported inputs</StyledSubTitle>
        <div>
          The <b>convertObjectToYaml</b> function supports multiple data types and structures, in
          order to simplify the creation of YAMLs.
        </div>
        <div>
          It can automatically deduce whether a given array is a chain of actions, or a list of
          values that are placed under the same key.
        </div>
        <div></div>
      </div>
      <div ref={(ref) => registerRef({ ref, content: "API" })}>
        <StyledSubTitle>API</StyledSubTitle>
        <APITable
          data={[
            {
              name: "obj",
              type: "Record<string, unknown>",
              description:
                "The given Javascript object that would be converted into a formatted YAML string.",
            },
            {
              name: "maintainQuotationsOnNumbers",
              type: "boolean, optional",
              description:
                "Dictates whether the formatted YAML string would generate quotation marks for string values or not.",
            },
            {
              name: "baseIndent",
              type: "string",
              defaultValue: `"${"\u00A0\u00A0"}"`,
              description:
                "Dictates the base indentation for the root rows and their following nested values.",
            },
          ]}
        />
      </div>
    </StyledCard>
  );
};
