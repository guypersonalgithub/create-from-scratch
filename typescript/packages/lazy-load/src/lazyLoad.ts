import { type Loader } from "./types";

type LazyLoadArgs<T> = {
  loader: Loader<T>;
};

export const lazyLoad = <T>({ loader }: LazyLoadArgs<T>) => {
  let promise: Promise<T> | null = null;

  return () => {
    if (!promise) {
      promise = loader();
    }

    return promise;
  };
};
