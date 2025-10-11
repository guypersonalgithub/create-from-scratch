type GetTriangleVerticesArgs = {
  element: Element;
};

// This solution is naive and requires careful tinkering.
export const getTriangleVertices = ({ element }: GetTriangleVerticesArgs) => {
  const rect = element.getBoundingClientRect();
  const top = [rect.left + rect.width / 2, rect.top];
  const bottomLeft = [rect.left, rect.bottom];
  const bottomRight = [rect.right, rect.bottom];

  return { top, bottomLeft, bottomRight };
};
