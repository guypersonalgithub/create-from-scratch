import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type TabKeyProps = {
  interactive?: boolean;
};

export const TabKey = ({ interactive }: TabKeyProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: inline-block;
          padding: 10px 24px;
          background-color: #eee;
          border: 1px solid #bbb;
          border-radius: 20px;
          font-family: monospace;
          font-size: 14px;
          user-select: none;
          position: relative;
        `,
        interactive &&
          dynatic`
            &:active {
              transform: translateY(1px);
              box-shadow: inset 0 -1px 0 #999, 0 1px 3px rgba(0, 0, 0, 0.15);
            }  
          `,
      )}
    >
      <span
        className={dynatic`
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
        `}
      >
        ⇥
      </span>{" "}
      Tab
    </div>
  );
};
