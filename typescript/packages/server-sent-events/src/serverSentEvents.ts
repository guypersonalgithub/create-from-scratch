import { Request, Response } from "express";

type ServerSentEventsArgs = {
  clientOrigin: string;
  withCredentials?: boolean;
  initialMessage: string;
};

export const serverSentEvents = ({
  clientOrigin,
  withCredentials,
  initialMessage,
}: ServerSentEventsArgs) => {
  let clients: Response[] = [];

  const callback = (req: Request, res: Response) => {
    // Required SSE headers
    res.setHeader("Access-Control-Allow-Origin", clientOrigin);
    if (withCredentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Initial message
    res.write(initialMessage);

    clients.push(res);

    req.on("close", () => {
      clients = clients.filter((c) => c !== res);
    });
  };

  return {
    clients,
    callback,
  };
};
