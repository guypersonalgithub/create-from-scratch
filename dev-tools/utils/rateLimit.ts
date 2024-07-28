import { delay } from "./delay";

type RateLimitArgs<T> = {
  promises: Promise<T>[];
  concurrencyLimit: number;
  delayMS: number;
};

export const rateLimit = async <T>({ promises, concurrencyLimit, delayMS }: RateLimitArgs<T>) => {
  const batches: Promise<T>[][] = [];

  for (let i = 0; i < promises.length; i += concurrencyLimit) {
    batches.push(promises.slice(i, i + concurrencyLimit));
  }

  let batchIndex = 0;

  while (batchIndex < batches.length) {
    const response = await Promise.all(batches[batchIndex]);
    batchIndex++;
    console.log({ response, date: new Date() });
    await delay({ ms: delayMS });
  }
};
