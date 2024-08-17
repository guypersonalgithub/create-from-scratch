import { useEffect } from "react";
import { useRouteParams } from "@packages/router";

export const RouteParam = () => {
  const params = useRouteParams();

  useEffect(() => {
    return () => {
      console.log("switch");
    };
  }, []);

  return <div>test</div>;
};
