type SetArgs = {
  callback: () => void;
  delay?: number;
};

export const debounce = () => {
  let timer: NodeJS.Timeout | null = null;

  const set = ({ callback, delay = 100 }: SetArgs) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => callback(), delay);
  };

  return { set };
};
