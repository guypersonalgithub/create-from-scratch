import type { Meta, StoryObj } from "@storybook/react";
import { SVGSparkline } from "@packages/svg-sparkline";

const meta = {
  title: "SVGSparkline",
  component: SVGSparkline,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SVGSparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: [10, 20, 30, 10, 12, 4],
  },
  render: (args) => <SVGSparkline {...args} />,
};
