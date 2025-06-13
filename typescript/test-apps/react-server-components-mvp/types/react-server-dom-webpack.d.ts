declare module "react-server-dom-webpack/client.edge" {
  import { type ReactElement } from "react";

  type Manifest = {
    moduleMap: Record<string, { id: string; chunks: string[]; name: string; async: boolean }>;
    serverModuleMap: {};
    moduleLoading: string;
  };

  export function createFromFetch(
    promise: Promise<Response>,
    { serverConsumerManifest: Manifest },
  ): Promise<ReactElement>;
}

declare module "react-server-dom-webpack/server.edge" {
  import { type ReactElement } from "react";
  import { type ReadableStream } from "stream/web";

  export function renderToReadableStream(
    element: ReactElement,
    options?: {
      context?: any;
      bootstrapModules?: string[];
    },
  ): Promise<ReadableStream>;
}
