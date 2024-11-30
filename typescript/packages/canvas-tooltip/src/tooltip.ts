export class Tooltip {
  x: number;
  y: number;
  id: number;

  constructor({ x, y, id }: { x: number; y: number; id: number }) {
    this.x = x;
    this.y = y;
    this.id = id;
  }

  alterPosition = (x: number, y: number, id: number) => {
    this.x = x;
    this.y = y;
    this.id = id;
  };

  drawTooltip = (canvas: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    canvas.clearRect(0, 0, canvasWidth, canvasHeight);
    canvas.fillRect(this.x, this.y, 50, 50);
  };

  clear = (canvas: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    canvas.clearRect(0, 0, canvasWidth, canvasHeight);
  };
}
