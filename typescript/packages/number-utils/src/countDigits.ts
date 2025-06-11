type CountDigitsArgs = {
  num: number;
};

export const countDigits = ({ num }: CountDigitsArgs) => {
  let integerDigits = 0;
  let fractionDigits = 0;
  let numString = num.toString();

  let afterDot = false;
  let isNegative = false;

  const firstChar = numString[0];
  if (firstChar === "-") {
    isNegative = true;
    numString.slice(1);
  }

  for (let i = 0; i < numString.length; i++) {
    const current = numString[i];
    if (current === ".") {
      afterDot = true;
      continue;
    }

    if (!afterDot) {
      integerDigits++;
    } else {
      fractionDigits++;
    }
  }

  return {
    numString,
    isNegative,
    integerDigits,
    fractionDigits,
  };
};
