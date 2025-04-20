import type { Meta, StoryObj } from "@storybook/react";
import { DrawingCanvas } from "@packages/drawing-canvas";

const meta = {
  title: "DrawingCanvas",
  component: DrawingCanvas,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DrawingCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => {
    return <DrawingCanvas />;
  },
};
