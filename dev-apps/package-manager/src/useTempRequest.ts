import { useEffect, useState } from "react";
import type { NPMRegistry } from "@packages/detect-repository-dependencies-types";
import { sendRequest } from "@packages/request";

type UseFetchMetadataProps = {
  packageName?: string;
};

export const useFetchMetadata = ({ packageName }: UseFetchMetadataProps) => {
  const [data, setData] = useState<NPMRegistry | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (data || !packageName) {
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const received = await sendRequest<{ data: NPMRegistry }>({
          url: `http://localhost:${import.meta.env.VITE_BACK_PORT}/metadata`,
          params: {
            packageName,
          },
          fallback: {
            data: {} as NPMRegistry,
          },
        });

        const { data } = received?.response ?? {};

        setData(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [packageName]);

  return {
    data,
    isLoading,
    isError,
  };
};
