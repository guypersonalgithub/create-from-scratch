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
          The <b>convertObjectToYaml</b> function supports multiple data types and structures, in
          order to simplify the creation of YAMLs.
        </div>
        <List items={[]} />
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
          ]}
        />
      </div>
    </StyledCard>
  );
};
