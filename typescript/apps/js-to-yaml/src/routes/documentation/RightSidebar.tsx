import { type CSSProperties } from "react";
import { ScrollspyAnchors } from "@packages/scrollspy-anchors";
import { useComplexSharedState } from "../../StateManagement";
import { dynatic } from "../../dynatic-css.config";
import { combineStringsWithSpaces } from "@packages/string-utils";

type RightSidebarProps = {
  className?: string;
  style?: CSSProperties;
};

export const RightSidebar = ({ className, style }: RightSidebarProps) => {
  const anchors = useComplexSharedState((data) => data.documentationAnchors);

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
        overflow-y: auto;
        overflow-x: hidden;
        min-width: 200px;
        padding: 10px;
      `,
        className,
      )}
      style={style}
    >
      {anchors.length > 0 ? (
        <div
          className={dynatic`
          font-weight: bolder;
        `}
        >
          Sections
        </div>
      ) : null}
      <ScrollspyAnchors
        anchors={anchors}
        anchorClassName="anchor"
        visibleAnchorClassName="visibleAnchor"
        highlightBarClassName={dynatic`
          background-color: ${(config) => config.shared.lightBlue};
        `}
      />
    </div>
  );
};
