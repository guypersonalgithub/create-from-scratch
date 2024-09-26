type CalculateBaseWithOffsetArgs = {
  base: string | number;
  offset?: number;
};

export const calculateBaseWithOffset = ({ base, offset = 0 }: CalculateBaseWithOffsetArgs) => {
  if (typeof base === "string") {
    return `calc(${base} + ${offset}px)`;
  }

  return `calc(${base + offset}px)`;
};
