type ScaleCanvasByDevicePixelRatioArgs = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
};

export const scaleCanvasByDevicePixelRatio = ({
  canvas,
  ctx,
  width,
  height,
}: ScaleCanvasByDevicePixelRatioArgs) => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);
};
