import { useRef } from "react";
import { generateSecureRandomString } from "@packages/randomizer";
import { type ModalDisplayProps } from "./types";

export const useControlModal = () => {
  const id = useRef(generateSecureRandomString());

  const openModal = ({ content, style }: Omit<ModalDisplayProps, "id">) => {
    const event = new CustomEvent<ModalDisplayProps>("openModal", {
      detail: { id: id.current, content, style },
    });
    window.dispatchEvent(event);
  };

  const closeModal = () => {
    const event = new CustomEvent<Pick<ModalDisplayProps, "id">>("closeModal", {
      detail: { id: id.current },
    });
    window.dispatchEvent(event);
  };

  return {
    id: id.current,
    openModal,
    closeModal,
  };
};
