import { Anchor, AnchorData } from "./types";

type GetLowestAnchorIndexArgs = {
  visibleAnchors: string[];
  anchors: Anchor[];
};

export const getLowestAnchorIndex = ({ visibleAnchors, anchors }: GetLowestAnchorIndexArgs) => {
  if (visibleAnchors.length === 0) {
    return -1;
  }

  const anchorsMap: Record<string, AnchorData> = {};

  anchors.forEach((anchor, index) => {
    const { id, ref } = anchor;

    anchorsMap[id] = { element: ref, index };
  });

  let { top: lowestAnchor, index: lowestAnchorIndex } = getVisibleAnchorProperties({
    id: visibleAnchors[0],
    anchorsMap,
  });

  for (let i = 1; i < visibleAnchors.length; i++) {
    const { top, index } = getVisibleAnchorProperties({ id: visibleAnchors[i], anchorsMap });
    if (top > lowestAnchor) {
      lowestAnchorIndex = index;
      lowestAnchor = top;
    }
  }

  return lowestAnchorIndex;
};

type GetVisibleAnchorPropertiesArgs = {
  id: string;
  anchorsMap: Record<string, AnchorData>;
};

const getVisibleAnchorProperties = ({ id, anchorsMap }: GetVisibleAnchorPropertiesArgs) => {
  const { element, index } = anchorsMap[id];
  const { top } = element.getBoundingClientRect();

  return {
    top,
    index,
  };
};
