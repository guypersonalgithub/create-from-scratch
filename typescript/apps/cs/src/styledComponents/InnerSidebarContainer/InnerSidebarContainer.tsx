import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "../../dynatic-css.config";
import { InnerSidebar } from "./InnerSidebar";
import { InnerSidebarProps } from "./types";
import { type ReactNode } from "react";

type InnerSidebarContainerProps<T extends string> = InnerSidebarProps<T> & {
  className?: string;
  sidebarClassName?: string;
  content: ReactNode;
};

export const InnerSidebarContainer = <T extends string>({
  className,
  sidebarClassName,
  items,
  current,
  onClick,
  content,
}: InnerSidebarContainerProps<T>) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          height: 100%;
          background: linear-gradient(135deg, #0f0f0f, #151515);
          color: #e5e5e5;
          font-family: Inter, system-ui, sans-serif;
          overflow: hidden;
        `,
        className,
      )}
    >
      <InnerSidebar
        className={sidebarClassName}
        items={items}
        current={current}
        onClick={onClick}
      />
      <div
        className={dynatic`
            flex: 1;
        `}
      >
        {content}
      </div>
    </div>
  );
};
