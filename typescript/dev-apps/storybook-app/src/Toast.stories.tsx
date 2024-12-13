import type { Meta } from "@storybook/react";
import { ToastManager, useControlToast } from "@packages/toast";

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
                  style={{
                    width: "800px",
                    height: "500px",
                    backgroundColor: "ThreeDShadow",
                    borderRadius: "5%",
                  }}
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
