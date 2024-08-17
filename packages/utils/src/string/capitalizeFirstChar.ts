type CapitalizeFirstCharArgs = {
  str: string;
};

export const capitalizeFirstChar = ({ str }: CapitalizeFirstCharArgs) => {
  return str[0].toUpperCase() + str.slice(1);
};
