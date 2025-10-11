import { testRoot } from "./render";

type GetByTextArgs = {
  text: string;
};

export const getByText = ({ text }: GetByTextArgs) => {
  if (!testRoot) {
    return;
  }

  const el = [...testRoot.querySelectorAll("*")].find((e) => e.textContent === text);
  if (!el) {
    throw new Error(`Element with text "${text}" not found`);
  }
  return el;
};
