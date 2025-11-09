import type { Meta } from "@storybook/react";
import { EllipsisTooltip, TooltipManager } from "@packages/tooltip";
import { dynatic } from "@packages/dynatic-css";

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
      <>
        <EllipsisTooltip
          content="Copied"
          className={dynatic`
            width: 50px;
          `}
        >
          Testing123456789
        </EllipsisTooltip>
        <TooltipManager />
      </>
    );
  },
};
