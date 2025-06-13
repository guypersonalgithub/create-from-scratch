import { useEffect, useState } from "react";

type SplitPathnameArgs = {
  pathname: string;
};

export const useParsePathname = () => {
  const splitPathname = ({ pathname }: SplitPathnameArgs) => {
    const splitPath = pathname.slice(1).split("/");

    return splitPath.map((path, index) => {
      let fullPath = "";

      for (let i = 0; i < index + 1; i++) {
        fullPath += `/${splitPath[i]}`;
      }

      return {
        part: path,
        fullPath: fullPath ?? "/",
      };
    });
  };

  const [paths, setPaths] = useState<{ part: string; fullPath: string }[]>(
    splitPathname({ pathname: window.location.pathname }),
  );

  useEffect(() => {
    const handleUrlChange = () => {
      setPaths(splitPathname({ pathname: window.location.pathname }));
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("pushstate", handleUrlChange);
    window.addEventListener("replacestate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("pushstate", handleUrlChange);
      window.removeEventListener("replacestate", handleUrlChange);
    };
  }, []);

  return {
    paths,
  };
};
