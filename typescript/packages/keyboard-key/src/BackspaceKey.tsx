import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type BackspaceProps = {
  interactive?: boolean;
};

export const Backspace = ({ interactive }: BackspaceProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: inline-block;
          padding: 10px 20px;
          background-color: #ccc;
          border: 1px solid #999;
          border-radius: 6px;
          font-family: monospace;
          font-size: 14px;
          user-select: none;
          clipPath: polygon(0% 50%, 10% 0%, 100% 0%, 100% 100%, 10% 100%);
        `,
        interactive &&
          dynatic`
            &:active {
              transform: translateY(1px);
              box-shadow: inset 0 -1px 0 #999, 0 1px 3px rgba(0, 0, 0, 0.15);
            }  
          `,
      )}
    />
  );
};
