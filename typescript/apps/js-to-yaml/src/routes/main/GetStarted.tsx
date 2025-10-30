import { StyledButton, StyledCard, StyledCommandBox } from "../../customizedComponents";
import { Alert } from "@packages/alert";
import { Terminal } from "@packages/icons";
import { usePath } from "@packages/router";
import { dynatic } from "../../dynatic-css.config";

type GetStartedProps = {
  isDesktop: boolean;
};

export const GetStarted = ({ isDesktop }: GetStartedProps) => {
  const { moveTo } = usePath();

  return (
    <StyledCard style={{ width: isDesktop ? "50vw" : "calc(90vw - 30px)" }}>
      <div
        className={dynatic`
          display: flex;
          align-items: center;
          gap: 5px;
        `}
      >
        <Terminal
          style={{
            width: "24px",
            height: "24px",
            color: "rgba(0, 119, 184, 0.976)",
            marginTop: "4px",
          }}
        />
        <span
          className={dynatic`
            font-weight: bold;
            font-size: 25px;
          `}
        >
          Get Started
        </span>
      </div>
      <div
        className={dynatic`
          text-align: left;
        `}
      >
        Install JS-to-YAML in your project with the following command:
      </div>
      <div
        className={dynatic`
          display: flex;
          align-items: center;
          margin-top: 10px;
          gap: 20px;
          flex-wrap: wrap;
        `}
      >
        <StyledCommandBox
          style={{ flex: 1, minWidth: "230px" }}
          command="npm install -D js-to-yaml"
          copyToClipboard
          withIcons
        />
        <StyledButton
          style={{ flexShrink: 0 }}
          onClick={() => moveTo({ pathname: "/documentation" })}
          addArrow
        >
          Read docs
        </StyledButton>
      </div>
      <div
        className={dynatic`
          margin-top: 10px;
        `}
      >
        <Alert
          type="info"
          message="Once installed, you can easily convert javascript objects to yaml and vice versa."
        />
      </div>
    </StyledCard>
  );
};
