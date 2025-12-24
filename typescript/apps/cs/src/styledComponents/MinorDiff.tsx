import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "../dynatic-css.config";

type Diff = { type: "ADDED" | "DELETED" | "UNCHANGED"; value: string };

type GetDiffPrefeixArgs = {
  diff: Diff;
};

const getDiffPrefix = ({ diff }: GetDiffPrefeixArgs) => {
  if (diff.type === "ADDED") {
    return "+";
  }

  if (diff.type === "DELETED") {
    return "-";
  }
};

type GetDiffClassNameArg = {
  diff: Diff;
};

const getDiffClassName = ({ diff }: GetDiffClassNameArg) => {
  if (diff.type === "ADDED") {
    return dynatic`
        color: #22863a;
        background-color: #f0fff4;
    `;
  }

  if (diff.type === "DELETED") {
    return dynatic`
        color: #b31d28;
        background-color: #ffeef0;
    `;
  }
};

type MinroDiffProps = {
  diffs: Diff[];
};

export const MinorDiff = ({ diffs }: MinroDiffProps) => {
  return (
    <pre
      className={dynatic`
        display: flex;
        gap: 10px;
        background-color: #696262ff; 
    `}
    >
      <div
        className={dynatic`
            width: 10px;
            background-color: #F2F7F9;    
        `}
      />
      <div>
        {diffs.map((diff, index) => {
          const prefix = getDiffPrefix({ diff });

          return (
            <div
              key={`${diff.value}-${index}`}
              className={combineStringsWithSpaces(
                dynatic`
                  display: flex;
                  gap: 5px;
                  padding-left: 2px;
                  padding-right: 5px;
                `,
                getDiffClassName({ diff }),
              )}
            >
              <div
                className={dynatic`
                  width: 5px;
                `}
              >
                {prefix}
              </div>{" "}
              {diff.value}
            </div>
          );
        })}
      </div>
    </pre>
  );
};
