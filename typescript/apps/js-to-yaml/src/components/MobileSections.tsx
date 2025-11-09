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
        className={dynatic`
          padding: 8px;
          border: 1px;
          border-radius: 10px;
          display: flex;
          align-items: center;
        `}
      >
        <List
          className={dynatic`
            width: 18px;
            height: 18px;
          `}
        />
        <span
          className={dynatic`
            font-size: 13px;
          `}
        >
          Sections
        </span>
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
        anchorClassName="anchor"
        visibleAnchorClassName="visibleAnchor"
        highlightBarClassName={dynatic`
          background-color: ${(config) => config.shared.lightBlue};  
        `}
        onClickCallback={hidePopover}
      />
    </StyledCard>
  );
};
