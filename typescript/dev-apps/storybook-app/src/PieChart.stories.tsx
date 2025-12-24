import type { Meta } from "@storybook/react";
import { PieChart, type PieChartData } from "@packages/pie-chart";

const data: PieChartData[] = [
  { label: "A", value: 10, color: "#f44336" },
  { label: "B", value: 20, color: "#2196f3" },
  { label: "C", value: 30, color: "#4caf50" },
  { label: "D", value: 40, color: "#ff9800" },
];

const meta = {
  title: "PieChart",
  component: PieChart,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PieChart>;

export default meta;

export const Primary = {
  render: () => {
    return <PieChart data={data} width={500} height={500} />;
  },
};

export const Animated = {
  render: () => {
    return <PieChart data={data} width={500} height={500} animationDuration={1000} />;
  },
};

export const Staggered = {
  render: () => {
    return <PieChart data={data} width={500} height={500} animationDuration={1000} staggered />;
  },
};
