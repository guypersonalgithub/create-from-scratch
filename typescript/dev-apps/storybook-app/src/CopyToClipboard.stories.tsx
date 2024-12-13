import type { Meta, StoryObj } from "@storybook/react";
import { CopyToClipboard } from "@packages/copy-to-clipboard";

const meta = {
  title: "CopyToClipboard",
  component: CopyToClipboard,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CopyToClipboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    textToCopy: "Test",
  },
  render: (args) => {
    return <CopyToClipboard {...args} />;
  },
};
