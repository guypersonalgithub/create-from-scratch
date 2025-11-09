import type { Meta } from "@storybook/react";
import { ToastManager, useControlToast } from "@packages/toast";
import { dynatic } from "@packages/dynatic-css";

const meta = {
  title: "ToastManager",
  component: ToastManager,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ToastManager>;

export default meta;

export const Primary = {
  args: {},
  render: () => {
    const { showToast, hideToast } = useControlToast();

    return (
      <>
        <button
          onClick={() =>
            showToast({
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
                  <button onClick={() => hideToast()}>close</button>
                </div>
              ),
            })
          }
        >
          click
        </button>
        <ToastManager />
      </>
    );
  },
};
