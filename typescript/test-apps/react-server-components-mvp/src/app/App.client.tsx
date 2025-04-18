import { createRoot } from "react-dom/client";
import { createFromFetch } from "react-server-dom-webpack/client.edge";
import ssrManifest from "./react-client-manifest";
import { ReactNode } from "react";

const root = createRoot(document.getElementById("root")!);

createFromFetch(fetch("/rsc"), {
  serverConsumerManifest: ssrManifest,
}).then((rscElement: ReactNode) => {
  root.render(rscElement);
});
