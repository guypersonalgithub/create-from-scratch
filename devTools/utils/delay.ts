type DelayArgs = {
  ms: number;
};

export const delay = ({ ms }: DelayArgs) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
