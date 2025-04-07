import { StyledButton } from "../StyledButton";
import { PseudoTerminalVisuals } from "@packages/pseudo-terminal-visuals";
import { javascriptOutput, output, stringifiedObject } from "../yamlExample";
import { Alert } from "@packages/alert";
import { Card } from "@packages/card";
import { Terminal } from "@packages/icons";
import { CommandBox } from "@packages/command-box";

export const Main = () => {

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          color: "var(--theme-color)",
          transition: "var(--theme-transition)",
          // backgroundColor: "var(--theme-bg)",
          // transition: "var(--theme-transition)",
          // transition: "color 0.1s ease, background-color 0.5s ease",
        }}
      >
        <h1>JS to YAML</h1>
        <h3>An easy to use library that converts Javascript objects to YAMLs and vice versa.</h3>
        <StyledButton style={{ margin: "0 auto" }}>testing</StyledButton>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          justifyContent: "center",
          width: "60%",
          margin: "0 auto",
        }}
      >
        <PseudoTerminalVisuals code={stringifiedObject} highlightCode />
        <PseudoTerminalVisuals code={output} highlightCode language="yaml" />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          justifyContent: "center",
          width: "60%",
          margin: "0 auto",
        }}
      >
        <PseudoTerminalVisuals code={output} highlightCode language="yaml" />
        <PseudoTerminalVisuals code={`${javascriptOutput}`} highlightCode />
      </div>
      <Card style={{ width: "50vw", margin: "0 auto" }}>
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
        <div>Install JS-to-YAML in your project with the following command:</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: "10px", gap: "20px" }}>
          <CommandBox command="npm install js-to-yaml" copyToClipboard withIcons />
          <StyledButton style={{ whiteSpace: "nowrap", width: "200px" }}>Read docs</StyledButton>
        </div>
        <div style={{ marginTop: "10px" }}>
          <Alert
            type="info"
            message="Once installed, you can easily convert javascript objects to yaml and vice versa."
          />
        </div>
      </Card>
    </div>
  );
};
