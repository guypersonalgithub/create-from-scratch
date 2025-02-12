import type { Meta } from "@storybook/react";
import { Toggle } from "@packages/toggle";

const meta = {
  title: "Toggle",
  component: Toggle,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Toggle>;

export default meta;

export const Primary = {
  args: {},
  render: () => {
    return <Toggle onChange={(value) => console.log(value)} />;
  },
};
