import { useState, useEffect, useRef } from "react";
import { ModalDisplayProps } from "./types";
import {
  AnimationContainerWrapper,
  AnimationContainerWrapperProps,
} from "@packages/animation-container";

type ModalManagerProps = Partial<
  Pick<AnimationContainerWrapperProps, "onMount" | "onUnmount" | "mountOptions" | "unmountOptions">
>;

export const ModalManager = ({
  onMount,
  onUnmount,
  mountOptions,
  unmountOptions,
}: ModalManagerProps) => {
  const [modals, setModals] = useState<ModalDisplayProps[]>([]);
  const modalIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const openModal = (event: CustomEvent<ModalDisplayProps>) => {
      const { id, content } = event.detail;
      if (modalIds.current.has(id)) {
        return;
      }

      setModals((prev) => [...prev, { id, content }]);
      modalIds.current.add(id);
    };

    const closeModal = (event: CustomEvent<ModalDisplayProps>) => {
      const { id } = event.detail;

      if (!modalIds.current.has(id)) {
        return;
      }

      setModals((prev) => {
        const modalIndex = prev.findIndex((modal) => modal.id === id);
        if (modalIndex === -1) {
          return prev;
        }

        modalIds.current = new Set();
        if (modalIndex === 0) {
          return [];
        }

        const remainingModals = prev.slice(0, modalIndex);
        remainingModals.forEach((modal) => {
          modalIds.current.add(modal.id);
        });
        return remainingModals;
      });
    };

    window.addEventListener("openModal", openModal as EventListener);
    window.addEventListener("closeModal", closeModal as EventListener);

    return () => {
      window.removeEventListener("openModal", openModal as EventListener);
      window.removeEventListener("closeModal", closeModal as EventListener);
    };
  }, []);

  return (
    <AnimationContainerWrapper
      onMount={
        onMount ?? [
          { opacity: 0, visibility: "hidden" },
          { opacity: 1, visibility: "visible" },
        ]
      }
      onUnmount={onUnmount}
      mountOptions={mountOptions ?? { duration: 300 }}
      unmountOptions={unmountOptions}
      changeMethod="gradual"
      style={{ position: "absolute", top: 0, zIndex: 10000 }}
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
                  if (modalIndex === -1) {
                    return prev;
                  }

                  modalIds.current = new Set();
                  if (modalIndex === 0) {
                    return [];
                  }

                  const remainingModals = prev.slice(0, modalIndex);
                  remainingModals.forEach((modal) => {
                    modalIds.current.add(modal.id);
                  });
                  return remainingModals;
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
