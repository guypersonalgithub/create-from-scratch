import { useEffect } from "react";

type UseScrollToTheTopArgs = {
  changingDependency?: boolean | string | number;
};

export const useScrollToTheTop = ({ changingDependency }: UseScrollToTheTopArgs = {}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [changingDependency]);
};
