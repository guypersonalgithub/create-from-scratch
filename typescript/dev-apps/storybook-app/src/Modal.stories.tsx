import type { Meta } from "@storybook/react";
import { ModalManager, useControlModal } from "@packages/modal";
import { dynatic } from "@packages/dynatic-css";

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
                  className={dynatic`
                    width: 800px;
                    height: 500px;
                    background-color: ThreeDShadow;
                    border-radius: 5%;
                  `}
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
