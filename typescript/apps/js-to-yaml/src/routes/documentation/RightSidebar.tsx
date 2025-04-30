import { CSSProperties } from "react";
import { ScrollspyAnchors } from "@packages/scrollspy-anchors";
import { useComplexSharedState } from "../../StateManagement";

type RightSidebarProps = {
  style?: CSSProperties;
};

export const RightSidebar = ({ style }: RightSidebarProps) => {
  const anchors = useComplexSharedState((data) => data.documentationAnchors);

  return (
    <div
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        minWidth: "200px",
        padding: "10px",
        ...style,
      }}
    >
      {anchors.length > 0 ? <div style={{ fontWeight: "bolder" }}>Sections</div> : null}
      <ScrollspyAnchors
        anchors={anchors}
        anchorClass="anchor"
        visibleAnchorClass="visibleAnchor"
        highlightBarStyle={{ backgroundColor: "rgba(0, 119, 184, 0.976)" }}
      />
    </div>
  );
};
