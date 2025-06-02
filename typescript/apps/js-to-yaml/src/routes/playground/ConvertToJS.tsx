import { Alert } from "@packages/alert";
import { Card } from "@packages/card";
import { Info } from "@packages/icons";
import { convertObjectToString } from "@packages/object-utils";
import { StyledSyntaxHighlighter } from "../../styledComponents";
import { Textarea } from "@packages/textarea";
import { convertYamlToObject } from "@packages/yaml";
import { useState } from "react";
import { useBreakpoints } from "../../breakpoints";

export const ConvertToJS = () => {
  const [text, setText] = useState("");
  const js = convertYamlToObject({ str: text });
  const convertedObject = convertObjectToString({ obj: js });
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({ updateOn: ["desktop", "tablet"] });
  const isDesktop = breakpoint === "desktop";

  return (
    <Card>
      <div>
        <div
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          Convert to JS
        </div>
        <Alert
          message={
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ width: "25px", minWidth: "25px" }}>
                <Info />
              </div>
              <div>
                <div>Remember that YAMLs are all about identation.</div>
                <div>
                  For a value to be considered as a property of another value, it has to be below it
                  with the right amount of identation.
                </div>
                <div>
                  A value that identated in a way that doesn't fit any of its ancestors would be
                  ignored during the conversion process.
                </div>
              </div>
            </div>
          }
          type="info"
        />
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
        <StyledSyntaxHighlighter style={{ flex: 1 }} code={convertedObject} highlightCode />
      </div>
    </Card>
  );
};
