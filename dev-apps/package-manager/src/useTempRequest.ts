import { useEffect, useState } from "react";
import type { DependenciesMap } from "@packages/detect-repository-dependencies-types";
import { sendRequest } from "@packages/request";

type ParsedData = {
  name: string;
  instances: {
    path: string;
    version: string;
    belongsTo: string;
    dependencyType: string;
  }[];
}[];

export const useTempRequest = () => {
  const [data, setData] = useState<ParsedData | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const { data } = await sendRequest<{ data: DependenciesMap }>({
          url: `http://localhost:${import.meta.env.VITE_BACK_PORT}/detectDependencies`,
        });

        const parsedData = Object.entries(data).map(([key, value]) => {
          const instances = Object.entries(value).map(([path, details]) => {
            return {
              ...details,
              path,
            };
          });

          return {
            name: key,
            instances,
          };
        });

        setData(parsedData);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    data,
    isLoading,
    isError,
  };
};
