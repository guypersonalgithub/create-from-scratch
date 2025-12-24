import type { Meta } from "@storybook/react";
import { LineChart, type LineChartData } from "@packages/line-chart";

const data: LineChartData[] = [
  { x: 10, y: 10 },
  { x: 20, y: 20 },
  { x: 30, y: 30 },
  { x: 40, y: 40 },
  { x: 100, y: 200 },
  { x: 200, y: 40 },
  { x: 300, y: 10 },
];

const meta = {
  title: "LineChart",
  component: LineChart,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LineChart>;

export default meta;

export const Primary = {
  render: () => {
    return (
      <LineChart
        data={data}
        width={500}
        height={500}
        axesOffset={100}
        padding={50}
        animationDuration={0}
      />
    );
  },
};
