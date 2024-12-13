import type { Meta, StoryObj } from "@storybook/react";
import { CanvasMathGraph } from "@packages/canvas-math-graph";

const meta = {
  title: "CanvasMathGraph",
  component: CanvasMathGraph,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CanvasMathGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    height: 500,
    width: 500,
  },
  render: (args) => {
    return <CanvasMathGraph {...args} />;
  },
};
