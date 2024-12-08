import type { Meta, StoryObj } from "@storybook/react";
import { Title } from "./Title";

const meta = {
  title: "Title",
  component: Title,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "test",
    titleWrapper: "h1",
  },
  render: (args) => <Title {...args} />,
};

export const TitleWithHightlight: Story = {
  args: {
    children: "test",
    titleWrapper: "h1",
    titleHighlight: "both",
  },
  render: (args) => <Title {...args} />,
};
