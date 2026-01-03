import type { Meta, StoryObj } from "@storybook/react";
import { Glitch } from "@packages/glitch";

const meta = {
  title: "Glitch",
  component: Glitch,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Glitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Test",
  },
  render: (args) => {
    return <Glitch {...args} />;
  },
};
