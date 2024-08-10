import { detectEnvironment } from "@packages/environment";
import { BackendArgs, FrontendArgs } from "./types";
import { getBackendBaseURL, getFrontendBaseURL } from "./utils";

function generateURL(args: FrontendArgs): URL;
function generateURL(args: BackendArgs): URL;

function generateURL(args: FrontendArgs | BackendArgs): URL {
  const environment = detectEnvironment();
  return environment === "frontend"
    ? getFrontendBaseURL(args as FrontendArgs)
    : getBackendBaseURL(args as BackendArgs);
}

export { generateURL };
