import type { Meta, StoryObj } from "@storybook/react";
import { PseudoTerminalVisuals } from "@packages/pseudo-terminal-visuals";

const meta = {
  title: "PseudoTerminalVisuals",
  component: PseudoTerminalVisuals,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PseudoTerminalVisuals>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    code: `let firstMessage='Hello World!'; 
console.log(firstMessage);`,
    animatedWriting: true,
    withCursor: true,
  },
  render: (args) => <PseudoTerminalVisuals {...args} />,
};
