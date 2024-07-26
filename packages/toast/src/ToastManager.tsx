import { useState, useEffect, useRef } from "react";
import { ToastDisplayProps } from "./types";
import {
  AnimationContainerWrapper,
  AnimationContainerWrapperProps,
} from "@packages/animation-container";
import "./styles.css";

type ToastManagerProps = Partial<Pick<AnimationContainerWrapperProps, "keyframes" | "options">>;

export const ToastManager = ({ keyframes, options }: ToastManagerProps) => {
  const [toasts, setToasts] = useState<ToastDisplayProps[]>([]);
  const toastIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const showToast = (event: CustomEvent<ToastDisplayProps>) => {
      const { id, content } = event.detail;
      if (toastIds.current.has(id)) {
        return;
      }

      setToasts((prev) => [...prev, { id, content }]);
      toastIds.current.add(id);
    };

    const hideToast = (event: CustomEvent<ToastDisplayProps>) => {
      const { id } = event.detail;

      if (!toastIds.current.has(id)) {
        return;
      }

      toastIds.current.delete(id);
      setToasts((prev) => {
        return prev.filter((toast) => toast.id !== id);
      });
    };

    window.addEventListener("showToast", showToast as EventListener);
    window.addEventListener("hideToast", hideToast as EventListener);

    return () => {
      window.removeEventListener("showToast", showToast as EventListener);
      window.removeEventListener("hideToast", hideToast as EventListener);
    };
  }, []);

  return (
    <AnimationContainerWrapper
      keyframes={
        keyframes ?? [
          {
            transform: "translateY(-100px)",
            offset: 0,
          },
          {
            transform: "translateY(100px)",
            offset: 0.3,
          },
          {
            transform: "translateY(300px)",
            offset: 0.5,
          },
          {
            transform: "translateY(350px)",
            offset: 0.64,
          },
          {
            transform: "translateY(300px)",
            offset: 1,
          },
        ]
      }
      options={options ?? { duration: 300 }}
      style={{
        position: "fixed",
        display: "block",
        width: "fit-content",
        height: "fit-content",
        top: "0px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {toasts.map(({ id, content }, index) => {
        return (
          <div
            key={id}
            style={{
              transform: `translateY(${(index + 1) * 100}px)`,
            }}
          >
            {content}
          </div>
        );
      })}
    </AnimationContainerWrapper>
  );
};
