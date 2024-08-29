import { useMemo } from "react";
import { generateSecureRandomString } from "@packages/randomizer";
import { ModalDisplayProps } from "./types";

export const useControlModal = () => {
  const id = useMemo(() => {
    return generateSecureRandomString();
  }, []);

  const openModal = ({ content }: Omit<ModalDisplayProps, "id">) => {
    const event = new CustomEvent<ModalDisplayProps>("openModal", {
      detail: { id, content },
    });
    window.dispatchEvent(event);
  };

  const closeModal = () => {
    const event = new CustomEvent<Pick<ModalDisplayProps, "id">>("closeModal", {
      detail: { id },
    });
    window.dispatchEvent(event);
  };

  return {
    openModal,
    closeModal,
    id,
  };
};
