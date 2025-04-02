type SaveAsImageArgs = {
  canvas: HTMLCanvasElement;
};

export const saveAsImage = ({ canvas }: SaveAsImageArgs) => {
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");

  link.href = dataURL;
  link.download = "drawing.png";
  document.body.appendChild(link); // Append to the DOM (required for Firefox)
  link.click();
  document.body.removeChild(link); // Remove immediately after download
};
