import type { Meta } from "@storybook/react";
import { ModalManager } from "./ModalManager";
import { useControlModal } from "./useControlModal";

const meta = {
  title: "ModalManager",
  component: ModalManager,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ModalManager>;

export default meta;

export const Primary = {
  args: {},
  render: () => {
    const { openModal, closeModal } = useControlModal();

    return (
      <>
        <button
          onClick={() =>
            openModal({
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
                  <button onClick={() => closeModal()}>close</button>
                </div>
              ),
            })
          }
        >
          click
        </button>
        <ModalManager />
      </>
    );
  },
};
