import { dynatic } from "@packages/dynatic-css";
import type { EnhancedDiff, NestedDiff } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";

type GetDiffLineClassNameArg = {
  line: EnhancedDiff;
};

const getDiffLineClassName = ({ line }: GetDiffLineClassNameArg) => {
  if (line.type === "ADDED" || line.type === "NESTED_ADD") {
    return dynatic`
      background-color: rgb(145, 226, 145);
    `;
  }

  if (line.type === "DELETED" || line.type === "NESTED_DELETE") {
    return dynatic`
      background-color: rgb(226, 145, 145);
    `;
  }

  if (line.type === "EMPTY") {
    return dynatic`
    background-image: repeating-linear-gradient(
      135deg,
    #f8f8f8 0 2.5px,
    #dcdcdc 2.5px 5px
    );
    `;
  }
};

type GetNestedDiffLineClassNameArgs = {
  type: NestedDiff["value"][number]["type"];
};

const getNestedDiffLineClassName = ({ type }: GetNestedDiffLineClassNameArgs) => {
  if (type === "HIGHLIGHTED_ADD") {
    return dynatic`
      background-color: rgba(96, 194, 96, 1);
    `;
  }

  if (type === "HIGHLIGHTED_DELETE") {
    return dynatic`
      background-color: rgba(182, 68, 68, 1);
    `;
  }
};

type DiffUIProps = {
  diff: EnhancedDiff[];
};

export const DiffUI = ({ diff }: DiffUIProps) => {
  return (
    <div
      className={dynatic`
        overflow-y: hidden;
        overflow-x: auto;
        height: fit-content;
      `}
    >
      {diff.map((line, index) => {
        const className = combineStringsWithSpaces(
          getDiffLineClassName({ line }),
          // TODO: add default height depending on the amount of line breaks or lines in general for the part
        );

        if (line.type === "EMPTY") {
          return (
            <div
              key={index}
              className={className}
              style={{ height: `calc(${line.size} * 18px)` }}
            />
          );
        }

        if (line.type === "NESTED_ADD" || line.type === "NESTED_DELETE") {
          return (
            <div
              key={`${line.value}-${index}`}
              className={combineStringsWithSpaces(
                dynatic`
                white-space: pre;
              `,
                className,
              )}
            >
              {line.value.map((part, index) => {
                return (
                  <span
                    key={`${part.value}-${index}`}
                    className={getNestedDiffLineClassName({ type: part.type })}
                  >
                    {part.value}
                  </span>
                );
              })}
            </div>
          );
        }

        return (
          <div
            key={`${line.value}-${index}`}
            className={combineStringsWithSpaces(
              dynatic`
                white-space: pre;
              `,
              className,
            )}
          >
            {line.value}
          </div>
        );
      })}
    </div>
  );
};
