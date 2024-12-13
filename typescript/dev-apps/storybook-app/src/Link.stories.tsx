import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "@packages/router";

const meta = {
  title: "Link",
  component: Link,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InternalLink: Story = {
  args: { pathname: "/1", children: "Click" },
  render: (args) => {
    return <Link {...args} />;
  },
};

export const ExternalLink: Story = {
  args: { href: "https://www.google.com/", children: "Click" },
  render: (args) => {
    return <Link {...args} />;
  },
};
