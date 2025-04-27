import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible } from "@packages/collapsible";
import { useEffect, useState } from "react";

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

export const DynamicContentChange: Story = {
  args: {
    title: "Title",
    children: <div>Test content</div>,
  },
  render: (args) => {
    const [content, setContent] = useState(<div>Test content</div>);

    useEffect(() => {
      setTimeout(() => {
        setContent(() => (
          <div>
            <div>Test content</div>
            <div>Teset content2</div>
          </div>
        ));
      }, 3000);
    }, []);

    return <Collapsible {...args}>{content}</Collapsible>;
  },
};
