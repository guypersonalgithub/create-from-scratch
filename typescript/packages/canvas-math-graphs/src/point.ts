export class Point {
  radius = 5;
  x: number;
  y: number;
  drawnX: number;
  drawnY: number;

  constructor({ x, y, drawnX, drawnY }: { x: number; y: number; drawnX: number; drawnY: number }) {
    this.x = x;
    this.y = y;
    this.drawnX = drawnX;
    this.drawnY = drawnY;
  }

  drawPoint = (context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.arc(this.drawnX, this.drawnY, this.radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  };
}
