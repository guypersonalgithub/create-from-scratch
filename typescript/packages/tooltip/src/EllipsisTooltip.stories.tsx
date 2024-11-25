import type { Meta } from "@storybook/react";
import { EllipsisTooltip } from "./EllipsisTooltip";

const meta = {
  title: "EllipsisTooltip",
  component: EllipsisTooltip,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof EllipsisTooltip>;

export default meta;

export const Primary = {
  render: () => {
    return (
      <EllipsisTooltip content="Copied" style={{ width: "50px" }}>
        Testing123456789
      </EllipsisTooltip>
    );
  },
};
