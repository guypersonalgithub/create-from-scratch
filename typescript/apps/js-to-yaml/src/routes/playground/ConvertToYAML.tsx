import { Card } from "@packages/card";
import { convertStringToObjectWithStringProperties } from "@packages/object-utils";
import { SyntaxHighlighter } from "@packages/syntax-highlighter";
import { Textarea } from "@packages/textarea";
import { convertObjectToYaml } from "@packages/yaml";
import { useState } from "react";
import { useGetBreakpoint } from "../../breakpoints";

export const ConvertToYAML = () => {
  const [text, setText] = useState("");
  const { object } = convertStringToObjectWithStringProperties({
    str: text,
    returnObjectOnIncorrectToken: true,
  });
  const yaml = convertObjectToYaml({ obj: object });
  const { breakpoint } = useGetBreakpoint();
  const isDesktop = breakpoint === "desktop";

  return (
    <Card>
      <div
        style={{
          textAlign: "center",
          height: "fit-content",
          marginBottom: "10px",
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        Convert to YAML
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          height: !isDesktop ? "300px" : "500px",
          flexDirection: !isDesktop ? "column" : "row",
        }}
      >
        <Textarea
          containerStyle={{ flex: 1 }}
          style={{ height: "100%" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();

              const textarea = e.currentTarget;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;

              const tab = "  "; // or "\t"

              setText((prev) => {
                return prev.slice(0, start) + tab + prev.slice(end);
              });

              requestAnimationFrame(() => {
                textarea.selectionStart = textarea.selectionEnd = start + tab.length;
              });
            }
          }}
        />
        <SyntaxHighlighter style={{ flex: 1 }} code={yaml} highlightCode language="yaml" />
      </div>
    </Card>
  );
};
