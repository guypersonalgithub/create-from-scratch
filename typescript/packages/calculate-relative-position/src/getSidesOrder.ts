import { Edges } from "@packages/edge-intersection";

type GetSidesOrderArgs = {
  side: Edges;
};

export const getSidesOrder = ({ side }: GetSidesOrderArgs): Edges[] => {
  if (side === "top") {
    return ["top", "topLeft", "topRight", "bottom", "bottomLeft", "bottomRight", "left", "right"];
  }

  if (side === "topLeft") {
    return ["topLeft", "top", "topRight", "bottom", "bottomLeft", "bottomRight", "left", "right"];
  }

  if (side === "topRight") {
    return ["topRight", "top", "topLeft", "bottom", "bottomLeft", "bottomRight", "left", "right"];
  }

  if (side === "bottom") {
    return ["bottom", "bottomLeft", "bottomRight", "top", "topLeft", "topRight", "left", "right"];
  }

  if (side === "bottomLeft") {
    return ["bottomLeft", "bottom", "bottomRight", "top", "topLeft", "topRight", "left", "right"];
  }

  if (side === "bottomRight") {
    return ["bottomRight", "bottom", "bottomLeft", "top", "topLeft", "topRight", "left", "right"];
  }

  if (side === "left") {
    return ["left", "topLeft", "bottomLeft", "right", "topRight", "bottomRight", "top", "bottom"];
  }

  return ["right", "topRight", "bottomRight", "left", "topLeft", "bottomLeft", "top", "bottom"];
};
