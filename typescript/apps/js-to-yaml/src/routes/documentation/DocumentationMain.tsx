import { StyledCard } from "../../styledComponents";
import { StyledTitle } from "../../styledComponents/StyledTitle";

export const DocumentationMain = () => {
  return (
    <div>
      <StyledCard style={{ margin: "1rem" }}>
        <StyledTitle>Overview</StyledTitle>
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
        <ul>
          <li>
            Convert Javascript object into fully formatted YAMLs. All you'll have to do then is save
            the output as files.
          </li>
          <li>
            Convert existing YAMLs into Javascript objects, in order to edit them, reconvert them
            back again and save the changes.
          </li>
          <li>
            Skip having to take care of indentation, command chaining and formatting as the package
            takes care of them for you automatically.
          </li>
          <li>
            The package itself doesn't use any specific functions that require a backend
            environment, it is mainly taking inputs and returning outputs, so in theory you can run
            them in client environments if you desire to do so.
          </li>
        </ul>
        <h2>Why JS to YAML compared to other YAML based packages?</h2>
        <div>
          When testing other libraries, some inconsistencies were encountered that required manual
          fixes and edits.
        </div>
        <div>This package's creation was partially due to these inconsistencies.</div>
        <div>
          It is also very lightweight and simple, without unnecessary overhead or complex API that
          requires constant research or trys in order to use accurately.
        </div>
      </StyledCard>
    </div>
  );
};
