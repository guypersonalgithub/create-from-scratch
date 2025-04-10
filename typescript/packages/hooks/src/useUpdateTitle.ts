import { useEffect } from "react";

type UseUpdateTitleArgs = {
  title: string;
};

export const useUpdateTitle = ({ title }: UseUpdateTitleArgs) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};
