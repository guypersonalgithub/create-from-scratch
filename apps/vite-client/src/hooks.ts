import { useEffect } from "react";
import { sendRequest } from "@packages/request";
import { ReturnedData } from "@packages/shared-types";

export const useRequestExample = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = await sendRequest<ReturnedData>({
        url: "http://localhost:3002",
      });
      console.log(data, data?.response?.prop1, data?.response?.prop1);
    };
    fetchData();
  }, []);
};
