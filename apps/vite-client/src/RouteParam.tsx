import { useEffect } from "react";
import { useRouteParams, useQueryParams } from "@packages/router";

export const RouteParam = () => {
  const params = useRouteParams();
  const query = useQueryParams();

  useEffect(() => {
    return () => {
      console.log("switch");
    };
  }, []);

  console.log(params, query);

  return <div>test</div>;
};
