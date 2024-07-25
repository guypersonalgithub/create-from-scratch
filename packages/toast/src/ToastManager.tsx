import { useState, useEffect } from "react";
import { ToastDisplayProps } from "./types";
import {
  AnimationContainerWrapper,
  AnimationContainerWrapperProps,
} from "@packages/animation-container";
import "./styles.css";

type ToastManagerProps = Partial<Pick<AnimationContainerWrapperProps, "from" | "to" | "options">>;

export const ToastManager = ({ from, to, options }: ToastManagerProps) => {
  const [toasts, setToasts] = useState<ToastDisplayProps[]>([]);
  const [disableToasts, setDisableToasts] = useState<boolean>(false);

  useEffect(() => {
    const showToast = (event: CustomEvent<ToastDisplayProps>) => {
      const { id, content } = event.detail;

      setToasts((prev) => [...prev, { id, content }]);
      setDisableToasts(false);
    };

    const hideToast = (event: CustomEvent<ToastDisplayProps>) => {
      const { id } = event.detail;
      setToasts((prev) => {
        const toastIndex = prev.findIndex((toast) => toast.id === id);
        if (toastIndex === 0) {
          return [];
        }

        return prev.slice(0, toastIndex);
      });
    };

    window.addEventListener("showToast", showToast as EventListener);
    window.addEventListener("hideToast", hideToast as EventListener);

    return () => {
      window.removeEventListener("showToast", showToast as EventListener);
      window.removeEventListener("hideToast", hideToast as EventListener);
    };
  }, []);

  if (disableToasts) {
    return null;
  }

  if (!toasts.length) {
    return null;
  }

  return (
    <AnimationContainerWrapper
      from={from ?? { top: "-100px" }}
      to={to ?? { top: "0px" }}
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
      {toasts.map(({ id, content }) => {
        return <div key={id}>{content}??</div>;
      })}
    </AnimationContainerWrapper>
  );
};
