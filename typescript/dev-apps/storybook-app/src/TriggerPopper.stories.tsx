import type { Meta } from "@storybook/react";
import { TriggerPopperManager, useControlTriggerPopper } from "@packages/trigger-popper";

const meta = {
  title: "TriggerPopperManager",
  component: TriggerPopperManager,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TriggerPopperManager>;

export default meta;

export const Primary = {
  args: {},
  render: () => {
    const { showTriggerPopper, hideTriggerPopper } = useControlTriggerPopper();

    return (
      <>
        <button
          onClick={() =>
            showTriggerPopper({
              content: (
                <div
                  style={{
                    width: "800px",
                    height: "500px",
                    backgroundColor: "ThreeDShadow",
                    borderRadius: "5%",
                  }}
                >
                  testing123
                  <button onClick={() => hideTriggerPopper()}>close</button>
                </div>
              ),
            })
          }
        >
          click
        </button>
        <TriggerPopperManager />
      </>
    );
  },
};
