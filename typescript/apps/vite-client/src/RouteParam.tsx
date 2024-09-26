import { useEffect } from "react";

export const RouteParam = () => {

  useEffect(() => {
    return () => {
      console.log("switch");
    };
  }, []);

  return <div>test</div>;
};
