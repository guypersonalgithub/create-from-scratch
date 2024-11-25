import { AxisProperties } from "./types";

export class AxesSpikes {
  private spikeLength = 20;
  private spikeWidth = 1;
  private spikeSplit = 9;
  private numberOfDivides = 40;
  private spikeGap = 2;
  graphWidth: number;
  graphHeight: number;
  horizontalAxis: AxisProperties;
  verticalAxis: AxisProperties;
  range: { min: number; max: number };

  constructor({
    graphWidth,
    graphHeight,
    horizontalAxis,
    verticalAxis,
    min,
    max,
  }: {
    graphWidth: number;
    graphHeight: number;
    horizontalAxis: AxisProperties;
    verticalAxis: AxisProperties;
    min: number;
    max: number;
  }) {
    this.graphWidth = graphWidth;
    this.graphHeight = graphHeight;
    this.horizontalAxis = horizontalAxis;
    this.verticalAxis = verticalAxis;
    this.range = { min, max };
  }

  drawAxesSpikes = (context: CanvasRenderingContext2D) => {
    let divideCounter = 2;
    const gap =
      (Math.abs(this.range.min) + Math.abs(this.range.max)) /
      (this.numberOfDivides / this.spikeGap);
    for (let i = this.range.min + gap; i < this.range.max; i = i + gap) {
      if (i === 0) {
        this.drawHorizontalZero(context, divideCounter);
        divideCounter = divideCounter + this.spikeGap;
        continue;
      }
      this.drawHorizontalSpikes(context, divideCounter);
      this.drawHorizontalNumber(context, divideCounter, i);
      this.drawVerticalSpikes(context, divideCounter);
      this.drawVerticalNumber(context, divideCounter, i);
      divideCounter = divideCounter + this.spikeGap;
    }
  };

  drawHorizontalSpikes = (context: CanvasRenderingContext2D, divideCounter: number) => {
    const xGap = (divideCounter * this.graphWidth) / this.numberOfDivides;
    const yInsertedInAxis = this.horizontalAxis.y - this.spikeSplit;
    context.fillRect(xGap, yInsertedInAxis, this.spikeWidth, this.spikeLength);
  };

  drawVerticalSpikes = (context: CanvasRenderingContext2D, divideCounter: number) => {
    const xInsertedInAxis = this.verticalAxis.x - this.spikeSplit;
    const yGap = (divideCounter * this.graphHeight) / this.numberOfDivides;
    context.fillRect(xInsertedInAxis, yGap, this.spikeLength, this.spikeWidth);
  };

  drawHorizontalNumber = (
    context: CanvasRenderingContext2D,
    divideCounter: number,
    currentNumber: number,
  ) => {
    const positionBasedOnSize = currentNumber <= 10 && currentNumber >= 0 ? 4 : 8;
    const xGap = (divideCounter * this.graphWidth) / this.numberOfDivides - positionBasedOnSize;
    const yPosition = this.horizontalAxis.y + 30;
    context.fillText(String(currentNumber), xGap, yPosition);
  };

  drawVerticalNumber = (
    context: CanvasRenderingContext2D,
    divideCounter: number,
    currentNumber: number,
  ) => {
    const flippedNumber = String(-1 * currentNumber); // On the canvas, the Y axis' flow is reversed, from top to bottom.
    const yGap = (divideCounter * this.graphHeight) / this.numberOfDivides + 5;
    const xPosition = this.verticalAxis.x + 20;
    context.fillText(flippedNumber, xPosition, yGap);
  };

  drawHorizontalZero = (context: CanvasRenderingContext2D, divideCounter: number) => {
    const uniqueGap = 15; // Since the regular xGap would put 0 on the Y axis, -15 moves it a bit to the left.
    const xGap = (divideCounter * this.graphWidth) / this.numberOfDivides - uniqueGap;
    const yPosition = this.horizontalAxis.y + 30;
    context.fillText("0", xGap, yPosition);
  };
}
