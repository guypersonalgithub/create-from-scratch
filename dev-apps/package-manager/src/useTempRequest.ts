import { useEffect, useRef, useState } from "react";
import type { LatestVersion } from "@packages/detect-repository-dependencies-types";
import { sendAbortableRequest, sendRequest } from "@packages/request";
import { getDisplayedRows } from "@packages/table";
import { getQueryParams } from "@packages/router";
import type { DetectDependenciesRoute } from "@packages/package-manager-shared-types";

type Data = (ParsedData[number] & { latestVersion?: Omit<LatestVersion[number], "name"> })[];

type ParsedData = {
  name: string;
  instances: {
    path: string;
    version: string;
    belongsTo: string;
    dependencyType: string;
  }[];
  isLocal: boolean;
}[];

type FetchMetadataArgs = {
  rowsPerPage?: number;
  pagination: number;
};

type AttachMetadataArgs = {
  data?: Data;
  latestVersionData: LatestVersion;
};

export const useTempRequest = () => {
  const [data, setData] = useState<Data | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [isErrorVersions, setIsErrorVersions] = useState(false);
  const abortRef = useRef<ReturnType<typeof sendAbortableRequest>["abort"]>();

  const attachMetadata = ({ data, latestVersionData }: AttachMetadataArgs) => {
    if (!data) {
      return [];
    }

    const dataObject: Record<string, Omit<LatestVersion[number], "name">> = {};
    latestVersionData.forEach((version) => {
      const { name, ...rest } = version;
      dataObject[name] = rest;
    });

    return data.map((row) => {
      if (dataObject[row.name]) {
        const updatedRow = {
          ...row,
          latestVersion: dataObject[row.name],
        };

        return updatedRow;
      }

      return row;
    });
  };

  const fetchMetadata = async ({ rowsPerPage, pagination }: FetchMetadataArgs) => {
    abortRef.current?.();

    const dataArray = data ?? [];

    const packageNames = getDisplayedRows({
      rowsPerPage,
      currentPage: pagination,
      amountOfRows: dataArray.length,
      data: dataArray,
    })
      .filter((row) => !row.latestVersion && !row.isLocal)
      .map((row) => row.name);

    if (packageNames.length === 0) {
      if (isLoadingVersions) {
        setIsLoadingVersions(false);
      }

      if (isErrorVersions) {
        setIsErrorVersions(false);
      }

      return;
    }

    setIsLoadingVersions(true);
    setIsErrorVersions(false);

    try {
      const { sendRequestFunction, abort } = sendAbortableRequest();
      abortRef.current = abort;

      const { data: fetchedData } = await sendRequestFunction<{ data: LatestVersion }>({
        url: `http://localhost:${import.meta.env.VITE_BACK_PORT}/latest`,
        params: {
          packageNames,
        },
        fallback: {
          data: [],
        },
      });
      const parsedData = attachMetadata({ data, latestVersionData: fetchedData });
      setData(parsedData);
    } catch (error) {
      setIsErrorVersions(true);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  useEffect(() => {
    if (data) {
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const queryParams = getQueryParams();
        const pagination = Number(queryParams.pagination ?? 1);

        const { data, latestVersions } = await sendRequest<DetectDependenciesRoute>({
          url: `http://localhost:${import.meta.env.VITE_BACK_PORT}/detectDependencies`,
          params: {
            pagination,
          },
          fallback: {
            data: {},
            latestVersions: [],
          },
        });

        const parsedData = Object.entries(data).map(([key, value]) => {
          const { data, isLocal } = value;
          const instances = Object.entries(data).map(([path, details]) => {
            return {
              ...details,
              path,
            };
          });

          return {
            name: key,
            instances,
            isLocal,
          };
        });

        const parsedDataWithAttachedVersions = attachMetadata({
          data: parsedData,
          latestVersionData: latestVersions,
        });
        setData(parsedDataWithAttachedVersions);
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
    fetchMetadata,
    isLoadingVersions,
    isErrorVersions,
  };
};
