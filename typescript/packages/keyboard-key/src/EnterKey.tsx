import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type EnterKeyProps = {
  interactive?: boolean;
};

export const EnterKey = ({ interactive }: EnterKeyProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: inline-block;
          padding: 10px 30px 10px 16px;
          background-color: #ddd;
          border: 1px solid #aaa;
          border-radius: 6px 6px 12px 6px;
          font-family: monospace;
          font-size: 14px;
          position: relative;
          user-select: none;
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
      Enter
      <span
        className={dynatic`
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
        `}
      >
        ↩︎
      </span>
    </div>
  );
};
