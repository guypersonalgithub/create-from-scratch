type GetCanvasDataArgs = {
  canvas: HTMLCanvasElement;
};

export const getCanvasData = ({ canvas }: GetCanvasDataArgs) => {
  return canvas.toDataURL("image/png"); // Save as base64
};
