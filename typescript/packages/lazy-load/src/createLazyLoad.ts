import { Loader } from "./types";

type CreateLazyLoaderArgs<T> = {
  loader: Loader<T>;
};

export const createLazyLoader = <T>({ loader }: CreateLazyLoaderArgs<T>) => {
  let cache: Promise<T> | null = null;

  return {
    load: () => {
      if (!cache) cache = loader();
      return cache;
    },
    reset: () => {
      cache = null;
    },
  };
};
