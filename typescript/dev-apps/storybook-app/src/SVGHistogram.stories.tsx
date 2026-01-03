import type { Meta, StoryObj } from "@storybook/react";
import { SVGHistogram } from "@packages/svg-histogram";

const meta = {
  title: "SVGHistogram",
  component: SVGHistogram,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SVGHistogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: [10, 4, 5, 20, 43]
  },
  render: (args) => <SVGHistogram {...args} />,
};
