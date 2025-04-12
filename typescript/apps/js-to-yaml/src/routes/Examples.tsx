import { SyntaxHighlighter } from "@packages/syntax-highlighter";
import { javascriptOutput, output, stringifiedObject } from "../yamlExample";
import { ArrowRight } from "@packages/icons";

export const Examples = () => {
  return (
    <div style={{ color: "var(--theme-color)", transition: "var(--theme-transition)" }}>
      <h1 style={{ textAlign: "center" }}>Javascript to YAML</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 50px 1fr",
          gap: "20px",
          justifyContent: "center",
          width: "60%",
          margin: "0 auto",
        }}
      >
        <SyntaxHighlighter code={stringifiedObject} highlightCode />
        <ArrowRight style={{ alignSelf: "center", height: "50px" }} />
        <SyntaxHighlighter code={output} highlightCode language="yaml" />
      </div>
      <h1 style={{ textAlign: "center" }}>YAML to Javascript</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 50px 1fr",
          gap: "20px",
          justifyContent: "center",
          width: "60%",
          margin: "0 auto",
        }}
      >
        <SyntaxHighlighter code={output} highlightCode language="yaml" />
        <ArrowRight style={{ alignSelf: "center", height: "50px" }} />
        <SyntaxHighlighter code={javascriptOutput} highlightCode />
      </div>
    </div>
  );
};
