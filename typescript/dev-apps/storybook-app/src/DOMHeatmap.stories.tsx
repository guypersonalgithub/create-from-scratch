import type { Meta, StoryObj } from "@storybook/react";
import { DOMHeatmap } from "@packages/dom-heatmap";

const meta = {
  title: "DOMHeatmap",
  component: DOMHeatmap,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DOMHeatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color1: [255, 255, 255],
    color2: [0, 200, 0],
    color3: [300, 100, 0],
    x: ["1", "2", "3", "4"],
    xStyle: { fontSize: "20px", fontWeight: "bolder", textAlign: "center" },
    y: ["A", "B", "C", "D", "E"],
    yStyle: { fontSize: "20px", fontWeight: "bolder", textAlign: "center" },
    data: [
      [10, -10, 30, 40, 50],
      [11, 12, -50, 40, 99],
      [5, 40, 1, 0, 9],
      [12, 13, 14, 9, 10],
    ],
    dataStyle: { width: "40px", height: "40px", textAlign: "center" },
  },
  render: (args) => {
    return <DOMHeatmap {...args} />;
  },
};
