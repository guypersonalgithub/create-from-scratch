import { List } from "@packages/icons";
import { Popover } from "@packages/popover";
import { Button } from "@packages/button";
import { StyledCard } from "../customizedComponents";
import { useComplexSharedState } from "../StateManagement";
import { type Anchor, ScrollspyAnchors } from "@packages/scrollspy-anchors";
import { dynatic } from "../dynatic-css.config";

export const MobileSections = () => {
  const anchors = useComplexSharedState((data) => data.documentationAnchors);

  if (anchors.length === 0) {
    return null;
  }

  return (
    <Popover
      content={({ hidePopover }) => <PopoverContent anchors={anchors} hidePopover={hidePopover} />}
    >
      <Button
        style={{
          padding: "8px",
          border: "1px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <List size={18} />
        <span className="text-sm">Sections</span>
      </Button>
    </Popover>
  );
};

type PopoverContentProps = {
  anchors: Anchor[];
  hidePopover: () => void;
};

const PopoverContent = ({ anchors, hidePopover }: PopoverContentProps) => {
  return (
    <StyledCard
      className={dynatic`
        overflow-y: auto;
        overflow-x: hidden;
        min-width: 200px;
        padding: 10px;
      `}
    >
      <ScrollspyAnchors
        anchors={anchors}
        anchorClass="anchor"
        visibleAnchorClass="visibleAnchor"
        highlightBarStyle={{ backgroundColor: "rgba(0, 119, 184, 0.976)" }}
        onClickCallback={hidePopover}
      />
    </StyledCard>
  );
};
