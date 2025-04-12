import { SubRouter, usePath } from "@packages/router";
import { StyledButton } from "../../styledComponents";
import { ConvertToYAML } from "./ConvertToYAML";
import { ConvertToJS } from "./ConvertToJS";

export const Playground = () => {
  const { moveTo } = usePath();

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>
        Test the package's capabilities by writing YAML/JS snippets and get the output in real time
      </h3>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <StyledButton onClick={() => moveTo({ pathname: "/playground/toYaml" })}>
          Convert to YAML
        </StyledButton>
        <StyledButton onClick={() => moveTo({ pathname: "/playground/toJS" })}>
          Convert to JS
        </StyledButton>
      </div>
      <SubRouter
        wrapperStyle={{ margin: "10px" }}
        paths={{
          "/": () => <></>,
          "/toYaml": <ConvertToYAML />,
          "/toJS": <ConvertToJS />,
        }}
      />
    </div>
  );
};
