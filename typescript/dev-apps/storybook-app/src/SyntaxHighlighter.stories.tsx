import type { Meta, StoryObj } from "@storybook/react";
import { SyntaxHighlighter } from "@packages/syntax-highlighter";

const meta = {
  title: "SyntaxHighlighter",
  component: SyntaxHighlighter,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SyntaxHighlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    code: `let firstMessage='Hello World!'; 
console.log(firstMessage);`,
    animatedWriting: true,
    withCursor: true,
  },
  render: (args) => <SyntaxHighlighter {...args} />,
};
