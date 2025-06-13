import http from "http";
import { type IncomingMessage, type ServerResponse } from "http";

const createProxyServer = () => {
  const proxyServer = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      console.log("Proxy forwarding to:", req.url);
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on("error", (err) => {
      console.error("Proxy request error:", err);
      res.statusCode = 500;
      res.end("Proxy Error");
    });

    req.pipe(proxyReq);
  });

  proxyServer.listen(process.env.PORT, () => {
    console.log(`Reverse Proxy is running on http://localhost:${process.env.PORT}`);
  });
};

createProxyServer();
