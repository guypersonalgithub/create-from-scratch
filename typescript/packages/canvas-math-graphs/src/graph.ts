import { Axes } from "./axes";

export class Graph {
  height: number;
  width: number;
  range: { min: number; max: number };
  axes: Axes;

  constructor({
    height,
    width,
    min,
    max,
  }: {
    height: number;
    width: number;
    min: number;
    max: number;
  }) {
    this.height = height;
    this.width = width;
    this.axes = new Axes({ graphHeight: height, graphWidth: width, min, max });
    this.range = { min, max };
  }

  initialize = (context: CanvasRenderingContext2D, color: string) => {
    context.clearRect(0, 0, this.width, this.height);
    context.fillStyle = color;
    context.fillRect(0, 0, this.width, this.height);
  };

  generateAxes = (context: CanvasRenderingContext2D, color: string) => {
    context.fillStyle = color;
    this.axes.drawAxes(context);
  };
}
