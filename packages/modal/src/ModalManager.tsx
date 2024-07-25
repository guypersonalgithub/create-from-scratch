import { useState, useEffect } from "react";
import { ModalDisplayProps } from "./types";
import {
  AnimationContainerWrapper,
  AnimationContainerWrapperProps,
} from "@packages/animation-container";

type ModalManagerProps = Partial<Pick<AnimationContainerWrapperProps, "from" | "to" | "options">>;

export const ModalManager = ({ from, to, options }: ModalManagerProps) => {
  const [modals, setModals] = useState<ModalDisplayProps[]>([]);
  const [disableModals, setDisableModals] = useState<boolean>(false);

  useEffect(() => {
    const openModal = (event: CustomEvent<ModalDisplayProps>) => {
      const { id, content } = event.detail;

      setModals((prev) => [...prev, { id, content }]);
      setDisableModals(false);
    };

    const closeModal = (event: CustomEvent<ModalDisplayProps>) => {
      const { id } = event.detail;
      setModals((prev) => {
        const modalIndex = prev.findIndex((modal) => modal.id === id);
        if (modalIndex === 0) {
          return [];
        }

        return prev.slice(0, modalIndex);
      });
    };

    window.addEventListener("openModal", openModal as EventListener);
    window.addEventListener("closeModal", closeModal as EventListener);

    return () => {
      window.removeEventListener("openModal", openModal as EventListener);
      window.removeEventListener("closeModal", closeModal as EventListener);
    };
  }, []);

  if (disableModals) {
    return null;
  }

  return (
    <AnimationContainerWrapper
      from={from ?? { opacity: 0, visibility: "hidden" }}
      to={to ?? { opacity: 1, visibility: "visible" }}
      options={options ?? { duration: 300 }}
    >
      {modals.map(({ id, content }) => {
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              display: "block",
              width: "100vw",
              height: "100vh",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "100vw",
                height: "100vh",
                opacity: 0.3,
                backgroundColor: "black",
              }}
              onClick={() => {
                setModals((prev) => {
                  const modalIndex = prev.findIndex((modal) => modal.id === id);
                  if (modalIndex === 0) {
                    return [];
                  }

                  return prev.slice(0, modalIndex);
                });
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {content}
            </div>
          </div>
        );
      })}
    </AnimationContainerWrapper>
  );
};
