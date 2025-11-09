import { Card } from "@packages/card";
import { convertStringToObjectWithStringProperties } from "@packages/object-utils";
import { StyledSyntaxHighlighter } from "../../customizedComponents";
import { Textarea } from "@packages/textarea";
import { convertObjectToYaml } from "@packages/yaml";
import { useState } from "react";
import { dynatic } from "../../dynatic-css.config";

export const ConvertToYAML = () => {
  const [text, setText] = useState("{}");
  const { object } = convertStringToObjectWithStringProperties({
    str: text,
    returnObjectOnIncorrectToken: true,
    skipLog: true,
  });
  const yaml = convertObjectToYaml({ obj: object });

  return (
    <Card>
      <div
        className={dynatic`
          text-align: center;
          height: fit-content;
          margin-bottom: 10px;
          font-size: 30px;
          font-weight: bold;
        `}
      >
        Convert to YAML
      </div>
      <div
        className={dynatic`
          display: flex;
          gap: 10px;
          height: 500px;
          flex-direction: row;

          ${(config) => config.utils.widthMediaQuery({ to: "1300px" })} {
            height: 300px;
            flex-direction: column;
          }
        `}
      >
        <Textarea
          containerClassName={dynatic`
            flex: 1;
          `}
          className={dynatic`
              height: 100%;
          `}
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
        <StyledSyntaxHighlighter
          className={dynatic`
            flex: 1;
          `}
          code={yaml}
          language="yaml"
          highlightCode
        />
      </div>
    </Card>
  );
};
