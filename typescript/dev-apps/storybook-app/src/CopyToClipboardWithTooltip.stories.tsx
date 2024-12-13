import type { Meta, StoryObj } from "@storybook/react";
import { CopyToClipboardWithTooltip } from "@packages/copy-to-clipboard";
import { TooltipManager } from "@packages/tooltip";

const meta = {
  title: "CopyToClipboardWithTooltip",
  component: CopyToClipboardWithTooltip,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CopyToClipboardWithTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    textToCopy: "test",
    children: <div>Click</div>,
  },
  render: (args) => {
    return (
      <>
        <CopyToClipboardWithTooltip {...args} />
        <TooltipManager />
      </>
    );
  },
};
