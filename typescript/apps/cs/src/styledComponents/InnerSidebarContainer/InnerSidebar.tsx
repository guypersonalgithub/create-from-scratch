import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "../../dynatic-css.config";
import { Button } from "@packages/button";
import { InnerSidebarProps } from "./types";

export const InnerSidebar = <T extends string>({
  className,
  items,
  current,
  onClick,
}: InnerSidebarProps<T>) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          width: 220px;
          border-right: 1px solid #222;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: rgba(0,0,0,0.4);
        `,
        className,
      )}
    >
      {items.map((item) => {
        const isSelected = item.value === current;

        return (
          <Button
            key={item.value}
            className={combineStringsWithSpaces(
              dynatic`
                padding: 14.5px 12px;
                border-radius: 8px;
                background: none;
                transition: all 0.2s;
                color: #aaa;
                border: none;
                text-align: left;

                &:hover {
                  background: linear-gradient(135deg, #ff0033, #660012);
                  color: #fff;
                  box-shadow: 0 0 0 1px rgba(255,0,50,0.4);
                }
              `,
              isSelected &&
                dynatic`
                    background: linear-gradient(135deg, #ff0033, #660012);
                    color: #fff;
                    box-shadow: 0 0 0 1px rgba(255,0,50,0.4);
                `,
            )}
            onClick={() => onClick(item.value)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};
