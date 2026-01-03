import type { Meta, StoryObj } from "@storybook/react";
import { SVGGauge } from "@packages/svg-gauge";

const meta = {
  title: "SVGGauge",
  component: SVGGauge,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SVGGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: 70
  },
  render: (args) => <SVGGauge {...args} />,
};
