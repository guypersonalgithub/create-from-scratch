import { ReactNode, useState } from "react";

type UseReoderOptionsArgs = {
  options: ReactNode[];
};

export const useReorderOptions = ({ options }: UseReoderOptionsArgs) => {
  const [currentOptions, setCurrentOptions] = useState(options);

  const reorder = () => {
    setCurrentOptions((arr) => {
      const newArray = [...arr];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    });
  };

  return {
    currentOptions,
    reorder,
  };
};
