import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible } from "./Collapsible";

const meta = {
  title: "Collapsible",
  component: Collapsible,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: "Title",
    children: <div>Test content</div>,
  },
  render: (args) => {
    return <Collapsible {...args} />;
  },
};
