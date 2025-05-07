import { StyledButton, StyledCard, StyledCommandBox } from "../../styledComponents";
import { Alert } from "@packages/alert";
import { Terminal } from "@packages/icons";
import { usePath } from "@packages/router";

type GetStartedProps = {
  isDesktop: boolean;
};

export const GetStarted = ({ isDesktop }: GetStartedProps) => {
  const { moveTo } = usePath();

  return (
    <StyledCard style={{ ...(isDesktop ? { width: "50vw" } : {}), margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <Terminal
          style={{
            width: "24px",
            height: "24px",
            color: "rgba(0, 119, 184, 0.976)",
            marginTop: "4px",
          }}
        />
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>Get Started</span>
      </div>
      <div style={{ textAlign: "left" }}>
        Install JS-to-YAML in your project with the following command:
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
          gap: "20px",
          flexWrap: "wrap",
        }}
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
      <div style={{ marginTop: "10px" }}>
        <Alert
          type="info"
          message="Once installed, you can easily convert javascript objects to yaml and vice versa."
        />
      </div>
    </StyledCard>
  );
};
