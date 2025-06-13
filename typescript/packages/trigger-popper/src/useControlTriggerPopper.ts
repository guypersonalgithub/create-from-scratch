import { useRef } from "react";
import { type TriggerPopperDisplayProps } from "./types";
import { generateSecureRandomString } from "@packages/randomizer";

export const useControlTriggerPopper = () => {
  const id = useRef(generateSecureRandomString());

  const showTriggerPopper = ({
    content,
    style,
    onMount,
    onUnmount,
    mountOptions,
    unmountOptions,
  }: Omit<TriggerPopperDisplayProps, "id">) => {
    const event = new CustomEvent<TriggerPopperDisplayProps>("showTriggerPopper", {
      detail: {
        id: id.current,
        content,
        style,
        onMount,
        onUnmount,
        mountOptions,
        unmountOptions,
      },
    });
    window.dispatchEvent(event);
  };

  const hideTriggerPopper = () => {
    const event = new CustomEvent<Pick<TriggerPopperDisplayProps, "id">>("hideTriggerPopper", {
      detail: { id: id.current },
    });
    window.dispatchEvent(event);
  };

  return {
    id: id.current,
    showTriggerPopper,
    hideTriggerPopper,
  };
};
