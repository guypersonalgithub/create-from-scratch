type CreateClassNameArgs = {
  value: string;
  pseudoClass?: string;
  mediaQuery?: string;
};

export const createClassName = ({ value, pseudoClass, mediaQuery }: CreateClassNameArgs) => {
  let baseValue = value;

  if (pseudoClass) {
    baseValue += pseudoClass;
  }

  if (mediaQuery) {
    baseValue = `${mediaQuery}-${baseValue}`;
  }

  return baseValue;
};
