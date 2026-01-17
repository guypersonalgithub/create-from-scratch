import type { Meta, StoryObj } from "@storybook/react";
import { StaggeredText } from "@packages/staggered";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

const meta = {
  title: "StaggeredText",
  component: StaggeredText,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof StaggeredText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Increase: Story = {
  args: {
    className: combineStringsWithSpaces(
      dynatic`
        ${(config) => config.utils.descendantSelector({ classNames: ["parent:hover", "char--transform: translateY(0);"] })} {
            transform: translateY(-30px);
        }
        `,
      "parent",
    ),
    charClassName: combineStringsWithSpaces(
      dynatic`
            transform: translateY(0);
        `,
      "char",
    ),
    children: "Test",
  },
  render: (args) => {
    return <StaggeredText {...args} />;
  },
};
