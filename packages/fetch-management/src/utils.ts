import { ExpiredAfter, ExtendedRequestTypeRegistry, PseudoData } from "./types";

type CalculateExpiredDateArgs = {
  expiredAfter?: ExpiredAfter;
};

export const calculateExpiredDate = ({ expiredAfter }: CalculateExpiredDateArgs) => {
  if (!expiredAfter) {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    return currentDate;
  }

  if (expiredAfter === "never") {
    return;
  }

  const [amountString, unit] = expiredAfter.split(" ");
  const amount = parseInt(amountString, 10);

  const currentDate = new Date();

  switch (unit) {
    case "seconds":
      currentDate.setSeconds(currentDate.getSeconds() + amount);
      break;
    case "minutes":
      currentDate.setMinutes(currentDate.getMinutes() + amount);
      break;
    case "hours":
      currentDate.setHours(currentDate.getHours() + amount);
      break;
    case "days":
      currentDate.setDate(currentDate.getDate() + amount);
      break;
    default:
      throw new Error("Invalid time unit");
  }

  return currentDate;
};

type DictateIsLoadingInitiallyArgs<K extends keyof ExtendedRequestTypeRegistry> = {
  initialData?: PseudoData<K>;
  disabled?: boolean;
};

export const dictateIsLoadingInitially = <K extends keyof ExtendedRequestTypeRegistry>({
  initialData,
  disabled,
}: DictateIsLoadingInitiallyArgs<K>) => {
  if (disabled) {
    return false;
  }

  const { data, isLoading, expiredAt } = initialData ?? {};

  if (isLoading || !data) {
    return true;
  }

  return expiredAt ? new Date() > expiredAt : false;
};
