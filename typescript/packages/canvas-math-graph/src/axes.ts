import { AxesSpikes } from "./axesSpikes";
import { type AxisProperties } from "./types";

export class Axes {
  private width = 2;
  graphWidth: number;
  graphHeight: number;
  horizontalAxis: AxisProperties;
  verticalAxis: AxisProperties;
  axesSpikes: AxesSpikes;

  constructor({
    graphWidth,
    graphHeight,
    min,
    max,
  }: {
    graphWidth: number;
    graphHeight: number;
    min: number;
    max: number;
  }) {
    this.graphWidth = graphWidth;
    this.graphHeight = graphHeight;
    this.horizontalAxis = { x: 0, y: this.graphHeight / 2, length: this.graphWidth };
    this.verticalAxis = { x: this.graphWidth / 2, y: 0, length: this.graphHeight };
    this.axesSpikes = new AxesSpikes({
      graphWidth,
      graphHeight,
      horizontalAxis: this.horizontalAxis,
      verticalAxis: this.verticalAxis,
      min,
      max,
    });
  }

  drawAxes = (context: CanvasRenderingContext2D) => {
    this.drawHorizontalAxis(context);
    this.drawVerticalAxis(context);
    this.generateAxesSpikes(context);
  };

  drawHorizontalAxis = (context: CanvasRenderingContext2D) => {
    context.fillRect(
      this.horizontalAxis.x,
      this.horizontalAxis.y,
      this.horizontalAxis.length,
      this.width,
    );
  };

  drawVerticalAxis = (context: CanvasRenderingContext2D) => {
    context.fillRect(
      this.verticalAxis.x,
      this.verticalAxis.y,
      this.width,
      this.verticalAxis.length,
    );
  };

  generateAxesSpikes = (context: CanvasRenderingContext2D) => {
    this.axesSpikes.drawAxesSpikes(context);
  };
}
