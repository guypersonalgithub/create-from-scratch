import type { Meta, StoryObj } from "@storybook/react";
import { SpreaderTitle } from "@packages/title";

const meta = {
  title: "SpreaderTitle",
  component: SpreaderTitle,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SpreaderTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "test",
  },
  render: (args) => <SpreaderTitle {...args} />,
};
