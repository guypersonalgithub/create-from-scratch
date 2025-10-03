import { type CSSProperties, useEffect } from "react";
import { type Anchor } from "./types";
import { observeElementsVisibility } from "@packages/element-utils";
import { Anchors } from "./Anchors";
import { useState } from "react";

type ScrollspyAnchorsProps = {
  anchors: Anchor[];
  anchorClass?: string;
  visibleAnchorClass?: string;
  anchorStyle?: CSSProperties;
  visibleAnchorStyle?: CSSProperties;
  highlightBarContainerStyle?: CSSProperties;
  highlightBarStyle?: CSSProperties;
  onClickCallback?: (anchor: { ref: HTMLElement }) => void;
};

export const ScrollspyAnchors = ({
  anchors,
  anchorClass,
  visibleAnchorClass,
  anchorStyle,
  visibleAnchorStyle,
  highlightBarContainerStyle,
  highlightBarStyle,
  onClickCallback,
}: ScrollspyAnchorsProps) => {
  const [availableAnchors, setAvailableAnchors] = useState<Anchor[]>([]);
  const [visibleAnchors, setVisibleAnchors] = useState<string[]>([]);
  const anchorsIdentifier = anchors.reduce((sum, current) => {
    return sum + current.id;
  }, "");

  useEffect(() => {
    setAvailableAnchors(anchors);
    setVisibleAnchors([]);
  }, [anchorsIdentifier]);

  useEffect(() => {
    const elements = availableAnchors.map((anchor) => anchor.ref);

    const observer = observeElementsVisibility({
      elements,
      intersectionCallback: ({ element }) => {
        const id = element.getAttribute("anchor-id");

        if (!id) {
          return;
        }

        setVisibleAnchors((prev) => {
          return [...prev, id];
        });
      },
      removalCallback: ({ element }) => {
        const id = element.getAttribute("anchor-id");

        if (!id) {
          return;
        }

        setVisibleAnchors((prev) => prev.filter((anchor) => anchor !== id));
      },
      threshold: [0.05],
    });

    return () => {
      observer.disconnect();
    };
  }, [availableAnchors]);

  if (availableAnchors.length === 0) {
    return null;
  }

  return (
    <Anchors
      anchors={availableAnchors}
      visibleAnchors={visibleAnchors}
      anchorClass={anchorClass}
      visibleAnchorClass={visibleAnchorClass}
      anchorStyle={anchorStyle}
      visibleAnchorStyle={visibleAnchorStyle}
      highlightBarContainerStyle={highlightBarContainerStyle}
      highlightBarStyle={highlightBarStyle}
      anchorsIdentifier={anchorsIdentifier}
      onClickCallback={onClickCallback}
    />
  );
};
