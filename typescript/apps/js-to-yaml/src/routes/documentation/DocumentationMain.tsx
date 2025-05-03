import { StyledCard } from "../../styledComponents";
import { StyledSubTitle, StyledTitle } from "../../styledComponents/StyledTitle";
import { useUpdateAnchors } from "../../useUpdateAnchors";
import { List } from "@packages/list";

export const DocumentationMain = () => {
  const { registerRef } = useUpdateAnchors();

  return (
    <div>
      <StyledCard>
        <StyledTitle>Introduction</StyledTitle>
        <div>
          JS to YAML is a package that helps automating the creation and maintenance process of YAML
          files.
        </div>
        <div>
          As a project grows bigger, you may require more and more YAML files in order to automate
          CI/CD processes.
        </div>
        <div>
          Instead of having to manually create, format and edit these files on changes, you could
          use this package in order to:
        </div>
        <List
          items={[
            "Convert Javascript object into fully formatted YAMLs. All you'll have to do then is save the output as files.",
            "Convert existing YAMLs into Javascript objects, in order to edit them, reconvert them back again and save the changes.",
            "Skip having to take care of indentation, command chaining and formatting as the package takes care of them for you automatically.",
            "The package itself doesn't use any specific functions that require a backend environment, it is mainly taking inputs and returning outputs, so in theory you can run them in client environments if you desire to do so.",
          ]}
        />
        <div ref={(ref) => registerRef({ ref, content: "Why" })}>
          <StyledSubTitle>Why JS to YAML compared to other YAML based packages?</StyledSubTitle>
          <div>
            When testing other libraries, some inconsistencies were encountered that required manual
            fixes and edits.
          </div>
          <div>This package's creation was partially due to these inconsistencies.</div>
          <div>
            It is also very lightweight and simple, without unnecessary overhead or complex API that
            requires constant research or trys in order to use accurately.
          </div>
        </div>
      </StyledCard>
    </div>
  );
};
