import { StyledButton } from "../StyledButton";
import { useUITheme } from "../UIThemes";
import { PseudoTerminalVisuals } from "@packages/pseudo-terminal-visuals";
import { javascriptOutput, output, yaml } from "../yamlExample";

export const Main = () => {
  const test = useUITheme();
  console.log({ test });

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1>JS to YAML</h1>
        <h3>A beautiful and minimal component library for modern web applications</h3>
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
        <PseudoTerminalVisuals
          code={`{
     property: {
         property2: "value",
     },
     property3: 2,
     deep: {
         nested: {
             value: ["1", "2"],
         }
     }
 }`}
          highlightCode
        />
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
        <PseudoTerminalVisuals code={yaml} highlightCode language="yaml" />
        <PseudoTerminalVisuals code={`${javascriptOutput}`} highlightCode />
      </div>
    </div>
  );
};
