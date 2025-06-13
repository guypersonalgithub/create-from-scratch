import { lazyLoad } from "./lazyLoad";
import { type Loader } from "./types";

type ConditionalLazyLoadArgs<T> = {
  condition: boolean;
  loader: Loader<T>;
};

export const conditionalLazyLoad = <T>({ condition, loader }: ConditionalLazyLoadArgs<T>) => {
  if (condition) {
    return lazyLoad({ loader });
  }

  return Promise.resolve(null);
};
