import type { Meta } from "@storybook/react";
import { TriggerPopperManager, useControlTriggerPopper } from "@packages/trigger-popper";
import { dynatic } from "@packages/dynatic-css";

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
                  className={dynatic`
                    width: 800px;
                    height: 500px;
                    background-color: ThreeDShadow;
                    border-radius: 5%;
                  `}
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
