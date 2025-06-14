import { Card } from "@packages/card";
import { convertStringToObjectWithStringProperties } from "@packages/object-utils";
import { StyledSyntaxHighlighter } from "../../styledComponents";
import { Textarea } from "@packages/textarea";
import { convertObjectToYaml } from "@packages/yaml";
import { useState } from "react";
import { useBreakpoints } from "../../breakpoints";

export const ConvertToYAML = () => {
  const [text, setText] = useState("{}");
  const { object } = convertStringToObjectWithStringProperties({
    str: text,
    returnObjectOnIncorrectToken: true,
    skipLog: true,
  });
  const yaml = convertObjectToYaml({ obj: object });
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({ updateOn: ["desktop", "tablet"] });
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
          onChange={(e) => {
            const textarea = e.currentTarget;
            const start = textarea.selectionStart;

            let value = e.target.value;
            if (value[0] !== "{") {
              value = "{" + value;
            }

            if (value[value.length - 1] !== "}") {
              value += "}";
            }

            setText(value);

            requestAnimationFrame(() => {
              textarea.selectionStart = textarea.selectionEnd = start;
            });
          }}
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
        <StyledSyntaxHighlighter style={{ flex: 1 }} code={yaml} language="yaml" highlightCode />
      </div>
    </Card>
  );
};
