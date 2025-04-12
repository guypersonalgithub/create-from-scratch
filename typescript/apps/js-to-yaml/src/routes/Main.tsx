import { StyledButton, StyledCard, StyledCommandBox } from "../styledComponents";
import { Alert } from "@packages/alert";
import { Terminal } from "@packages/icons";
import { useGetBreakpoint } from "../breakpoints";
import { usePath } from "@packages/router";

export const Main = () => {
  const { moveTo } = usePath();
  const { breakpoint } = useGetBreakpoint();
  const isMobile = breakpoint === "mobile";

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          color: "var(--theme-color)",
          transition: "var(--theme-transition)",
        }}
      >
        <h1>JS to YAML</h1>
        <h3>
          JS to YAML lets you avoid mundane repetitive YAML management tasks and lets you automate
          the process with ease.
        </h3>
        <StyledCard style={{ ...(!isMobile ? { width: "50vw" } : {}), margin: "0 auto" }}>
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
              command="npm install js-to-yaml"
              copyToClipboard
              withIcons
            />
            <StyledButton
              style={{ whiteSpace: "nowrap", width: "220px", flexShrink: 0 }}
              onClick={() => moveTo({ pathname: "/documentation" })}
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
      </div>
    </div>
  );
};
