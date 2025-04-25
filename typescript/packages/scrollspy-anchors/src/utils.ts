import { Anchor } from "./types";

type GetLowestAnchorIndexArgs = {
  visibleAnchors: string[];
  anchors: Anchor[];
};

export const getLowestAnchorIndex = ({ visibleAnchors, anchors }: GetLowestAnchorIndexArgs) => {
  const anchorsMap: Record<string, { element: Element; index: number }> = {};

  anchors.forEach((anchor, index) => {
    const { id, ref } = anchor;

    anchorsMap[id] = { element: ref, index };
  });

  let lowestAnchorIndex = -1;
  let lowestAnchor = 0;

  visibleAnchors.forEach((visibleAnchor) => {
    const { element, index } = anchorsMap[visibleAnchor];

    const { top } = element.getBoundingClientRect();

    if (top > lowestAnchor) {
      lowestAnchorIndex = index;
      lowestAnchor = top;
    }
  });

  return lowestAnchorIndex;
};
