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
      const { id, content, style } = event.detail;

      setModals((prev) => {
        const updated = [...prev];
        const index = prev.findIndex((modal) => modal.id === id);
        const modalContent = { id, content, style };
        if (index > -1) {
          updated[index] = modalContent;
        } else {
          updated.push(modalContent);
        }

        return updated;
      });
      modalIds.current.add(id);
    };

    const closeModal = (event: CustomEvent<ModalDisplayProps>) => {
      const { id } = event.detail;

      if (!modalIds.current.has(id)) {
        return;
      }

      setModals((prev) => {
        const remainingModals = prev.filter((modal) => modal.id !== id);
        modalIds.current.delete(id);
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
      disableMountAnimationOnInit={false}
    >
      {modals.map(({ id, content, style }) => {
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
                  const remainingModals = prev.filter((modal) => modal.id !== id);
                  modalIds.current.delete(id);
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
                ...style,
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
