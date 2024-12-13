import type { Meta } from "@storybook/react";
import { AutomaticTooltip, TooltipManager } from "@packages/tooltip";
import { useState } from "react";

const meta = {
  title: "AutomaticTooltip",
  component: AutomaticTooltip,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AutomaticTooltip>;

export default meta;

export const Primary = {
  render: () => {
    const [display, setDisplay] = useState(false);

    return (
      <>
        <AutomaticTooltip disabled={!display} content="Test">
          <button onClick={() => setDisplay(true)}>Click</button>
        </AutomaticTooltip>
        <TooltipManager />
      </>
    );
  },
};
