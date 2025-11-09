import { useState, useEffect, useRef } from "react";
import { type ModalDisplayProps } from "./types";
import {
  AnimationContainerWrapper,
  type AnimationContainerWrapperProps,
} from "@packages/animation-container";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

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
      const { id, content, className, style } = event.detail;

      setModals((prev) => {
        const updated = [...prev];
        const index = prev.findIndex((modal) => modal.id === id);
        const modalContent = { id, content, className, style };
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
      className={dynatic`
        position: absolute;
        top: 0;
        z-index: 10000;  
      `}
      disableMountAnimationOnInit={false}
    >
      {modals.map(({ id, content, className, style }) => {
        return (
          <div
            key={id}
            className={dynatic`
              position: absolute;
              display: block;
              width: 100vw;
              height: 100vh;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;  
            `}
          >
            <div
              className={dynatic`
                position: absolute;
                width: 100vw;
                height: 100vh;
                opacity: 0.3;
                background-color: black;
              `}
              onClick={() => {
                setModals((prev) => {
                  const remainingModals = prev.filter((modal) => modal.id !== id);
                  modalIds.current.delete(id);

                  return remainingModals;
                });
              }}
            />
            <div
              className={combineStringsWithSpaces(
                dynatic`
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                `,
                className,
              )}
              style={style}
            >
              {content}
            </div>
          </div>
        );
      })}
    </AnimationContainerWrapper>
  );
};
