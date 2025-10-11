type GetClipPathTriangleVerticesArgs = {
  element: Element;
};

export const getClipPathTriangleVertices = ({ element }: GetClipPathTriangleVerticesArgs) => {
  const style = getComputedStyle(element);
  const clip = style.clipPath;
  if (!clip || !clip.startsWith("polygon")) {
    return;
  }

  const match = clip.match(/polygon\((.+)\)/);
  if (!match) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const coords = match[1].split(",").map((str) => str.trim().split(" "));

  return coords.map(([pxStr, pyStr]) => {
    const px = pxStr.endsWith("%") ? parseFloat(pxStr) / 100 : parseFloat(pxStr) / rect.width;
    const py = pyStr.endsWith("%") ? parseFloat(pyStr) / 100 : parseFloat(pyStr) / rect.height;
    return { x: rect.left + px * rect.width, y: rect.top + py * rect.height };
  });
};
