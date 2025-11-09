import { SubRouter, usePath } from "@packages/router";
import { StyledButton } from "../../customizedComponents";
import { ConvertToYAML } from "./ConvertToYAML";
import { ConvertToJS } from "./ConvertToJS";
import { dynatic } from "../../dynatic-css.config";

export const Playground = () => {
  const { moveTo } = usePath();

  return (
    <div>
      <h3
        className={dynatic`
          text-align: center;
        `}
      >
        Test the package's capabilities by writing YAML/JS snippets and get the output in real time
      </h3>
      <div
        className={dynatic`
          display: flex;
          gap: 10px;
          justify-content: center;
        `}
      >
        <StyledButton onClick={() => moveTo({ pathname: "/playground" })}>
          Convert to YAML
        </StyledButton>
        <StyledButton onClick={() => moveTo({ pathname: "/playground/toJS" })}>
          Convert to JS
        </StyledButton>
      </div>
      <SubRouter
        wrapperClassName={dynatic`
          margin: 10px;
        `}
        paths={{
          "/": () => <ConvertToYAML />,
          "/toJS": <ConvertToJS />,
        }}
      />
    </div>
  );
};
