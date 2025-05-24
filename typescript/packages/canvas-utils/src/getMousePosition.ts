type GetMousePositionArgs = {
  event: MouseEvent;
  canvas: HTMLCanvasElement | null;
};

export const getMousePosition = ({ event, canvas }: GetMousePositionArgs) => {
  if (!canvas) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return { x, y };
};
