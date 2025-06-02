import { IncomingMessage, ServerResponse } from "http";
import { CORSOptions } from "./types";

type CreateCorsArgs = {
  options: CORSOptions;
};

type HandleCORSArgs = {
  req: IncomingMessage;
  res: ServerResponse;
};

export const createCORS = ({ options = {} }: CreateCorsArgs) => {
  const {
    origin = "*",
    methods = ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders,
    exposedHeaders,
    credentials = false,
    maxAge,
  } = options;

  const handleCORS = ({ req, res }: HandleCORSArgs) => {
    const requestOrigin = req.headers.origin;
    const resolvedOrigin = typeof origin === "function" ? origin(requestOrigin) : origin;

    if (resolvedOrigin) {
      res.setHeader("Access-Control-Allow-Origin", resolvedOrigin);
    }

    if (credentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    if (exposedHeaders && exposedHeaders.length > 0) {
      res.setHeader("Access-Control-Expose-Headers", exposedHeaders.join(", "));
    }

    if (req.method === "OPTIONS") {
      // Preflight
      res.statusCode = 204;

      res.setHeader("Access-Control-Allow-Methods", methods.join(", "));

      if (allowedHeaders && allowedHeaders.length > 0) {
        res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "));
      } else {
        const reqHeaders = req.headers["access-control-request-headers"];
        if (reqHeaders) {
          res.setHeader("Access-Control-Allow-Headers", reqHeaders);
        }
      }

      if (maxAge) {
        res.setHeader("Access-Control-Max-Age", String(maxAge));
      }

      res.end();
    }
  };

  return { handleCORS };
};
