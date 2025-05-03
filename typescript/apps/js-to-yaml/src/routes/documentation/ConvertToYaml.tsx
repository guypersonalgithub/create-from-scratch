import { TypescriptTokenTypes } from "@packages/parse-typescript";
import { APITable, InputOutput, StyledCard } from "../../styledComponents";
import { StyledTitle, StyledSubTitle } from "../../styledComponents/StyledTitle";
import { SyntaxHighlighter } from "@packages/syntax-highlighter";
import { useUpdateAnchors } from "../../useUpdateAnchors";
import { List } from "@packages/list";

export const ConvertToYaml = () => {
  const { registerRef } = useUpdateAnchors();

  return (
    <StyledCard>
      <StyledTitle>Convert to YAML</StyledTitle>
      <div>Javascript convertion to a YAML format is as simple as it can get.</div>
      <div>
        Import the <b>convertObjectToYaml</b> function, pass in the desired object, and then if
        desired, save in the output in a .yaml file:
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
      
  const output = convertObjectToYaml({ obj: testsConfig });`}
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
        <List
          items={[
            <div>
              <div>
                The function converts hierarchy of keys and their nested values into the typical
                YAML hierarchy, so that each nesting level would have a larger identation to match
                accordingly.
              </div>
              <InputOutput code={{ key: { key1: "value", key2: 2 } }} language="typescript" />
            </div>,
            <div>
              <div>
                Primitive values are treated as normal values. Quotation marks are normally removed
                from strings, however, by using the <b>maintainQuotationsOnNumbers</b> argument,
                quotation marks can still be added during the convertion process.
              </div>
              <InputOutput
                code={{ key: { key1: "value", key2: 2, key3: true, key4: undefined, key5: null } }}
                language="typescript"
              />
            </div>,
            <div>
              <div>
                Github workflow expression syntax is also treated as a normal value and would be
                translated accordingly.
              </div>
              <InputOutput
                code={{ key: "${{ github.event.head_commit.message }}" }}
                language="typescript"
              />
            </div>,
            "Arrays behave differently depending on the context they are used in.",
            <div>
              <div>
                If an array is the value of a <b>run</b> key, the process will convert the array
                content into a set of actions with the "|" prefix.
              </div>
              <InputOutput code={{ run: ["npm install", "npm run build"] }} language="typescript" />
            </div>,
            <div>
              <div>
                Otherwise, it would just list them as different entities with the "-" prefix.
              </div>
              <InputOutput code={{ values: [1, 2, "key", "value"] }} language="typescript" />
            </div>,
            <div>
              <b>Functions and classes are not supported.</b> YAML is a data serialization format,
              not a programming language.
            </div>,
          ]}
        />
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
              isMandatory: true,
            },
            {
              name: "maintainQuotationsOnNumbers",
              type: "boolean",
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
