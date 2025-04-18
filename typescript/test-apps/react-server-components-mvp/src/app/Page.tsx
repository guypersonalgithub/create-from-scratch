import { Suspense } from "react";
import { AsyncComponent } from "./AsyncComponent";

export const Page = () => {
  return (
    <>
      <h1>Hello server comps!</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <AsyncComponent />
      </Suspense>
    </>
  );
};
