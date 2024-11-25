import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { TooltipManager } from "./TooltipManager";

const meta = {
  title: "Tooltip",
  component: Tooltip,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    content: <div>test</div>,
    children: "Test",
  },
  render: (args) => {
    return (
      <>
        <Tooltip {...args} />
        <TooltipManager />
      </>
    );
  },
};
