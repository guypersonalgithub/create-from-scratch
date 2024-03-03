import { useEffect } from "react";
import { fetcher } from "./utils";
import { ReturnedData } from "@packages/shared-types";

export const useRequestExample = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetcher<ReturnedData>({
        url: "http://localhost:3002",
      });

      console.log(data, data.prop1, data.prop1);
    };

    fetchData();
  }, []);
};
