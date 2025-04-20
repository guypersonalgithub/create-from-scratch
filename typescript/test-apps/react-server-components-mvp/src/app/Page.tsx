import { Suspense } from "react";
import { AsyncComponent, AsyncComponent2 } from "./AsyncComponent";

export const Page = () => {
  return (
    <>
      <h1>Hello server comps!</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <AsyncComponent />
      </Suspense>
      <Suspense fallback={<p>Loading2...</p>}>
        <AsyncComponent2 />
      </Suspense>
    </>
  );
};
