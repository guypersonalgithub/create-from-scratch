import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@packages/textarea";

const meta = {
  title: "Textarea",
  component: Textarea,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Textarea content",
  },
  render: (args) => {
    return <Textarea {...args} />;
  },
};
