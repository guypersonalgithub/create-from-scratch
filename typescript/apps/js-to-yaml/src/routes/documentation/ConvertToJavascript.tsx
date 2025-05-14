import { TypescriptTokenTypes } from "@packages/parse-typescript";
import { APITable, InputOutput, StyledCard, StyledSyntaxHighlighter } from "../../styledComponents";
import { StyledSubTitle, StyledTitle } from "../../styledComponents/StyledTitle";
import { useUpdateAnchors } from "../../useUpdateAnchors";
import { List } from "@packages/list";

export const ConvertToJavascript = () => {
  const { registerRef } = useUpdateAnchors();

  return (
    <StyledCard>
      <StyledTitle>Convert to Javascript</StyledTitle>
      <div>Convertion to Javascript from a YAML format is really simple.</div>
      <div>
        Import the <b>convertYamlToObject</b> function, pass in the desired yaml string, and get the
        converted object.
      </div>
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
      <div ref={(ref) => registerRef({ ref, content: "Supported inputs" })}>
        <StyledSubTitle>Supported inputs</StyledSubTitle>
        <div>
          The <b>convertYamlToObject</b> function supports multiple string formats in order to
          simplify the conversion between YAMLs and Javascript objects.
        </div>
        <List
          items={[
            <div>
              <div>
                The function converts a hierarchy of keys and their nested values into a Javascript
                object. Each level of increased indentation would be translated into a further
                nested level of an Object keys and values.
              </div>
              <InputOutput
                code={`key:
  key1: value
  key2: 2`}
                language="yaml"
              />
            </div>,
            <div>
              <div>
                Primitive values are treated as normal values. Quotation marks are normally removed
                from strings, however, by using the <b>maintainQuotationsOnNumbers</b> argument,
                quotation marks can still be added during the convertion process.
              </div>
              <InputOutput
                code={`key:
  key1: value
  key2: 2
  key3: true
  key4: 
  key5: null`}
                language="yaml"
              />
            </div>,
            <div>
              <div>
                A list of items that have a "-" prefix with the same level of identation under a key
                with a smaller identation will be transformed into an array under the parent key.
              </div>
              <InputOutput
                code={`values:
  - 1
  - 2
  - key
  - value`}
                language="yaml"
              />
            </div>,
            <div>
              <div>
                A run command with the "|" identifier and atleast one command under it would be
                transformed into a run key with a multi-line string value with all associated
                commands.
              </div>
              <InputOutput
                code={`run: |
  npm install
  npm run build`}
                language="yaml"
              />
            </div>,
          ]}
        />
      </div>
      <div ref={(ref) => registerRef({ ref, content: "API" })}>
        <StyledSubTitle>API</StyledSubTitle>
        <APITable
          data={[
            {
              name: "str",
              type: "string",
              description: "The given Yaml string that would be converted into a Javascript.",
              isMandatory: true,
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
