import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@packages/slider";

const meta = {
  title: "Slider",
  component: Slider,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: (args) => {
    return <Slider {...args} />;
  },
};
