import express from "express";
import cors from "cors";
import { build } from "./utils";
// import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { renderToReadableStream } from "react-server-dom-webpack/server.edge";
import path from "path";
import { fileURLToPath } from "url";
import { Readable } from "stream";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  try {
    return res.send(`<!DOCTYPE html>
<html>
  <head><title>RSC Streaming</title></head>
  <body>
    <div id="root"></div>
    <script type="module" src="/build/App.client.js"></script>
  </body>
</html>
`);
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'build' directory
app.use("/build", express.static(path.join(__dirname, "build")));

app.get("/rsc", async (req, res) => {
  try {
    const Page = await import("./build/Page.js");
    // const html = renderToString(createElement(Page.Page));
    const stream = await renderToReadableStream(createElement(Page.Page));
    // res.send(html);
    // return new Response(stream);

    // Convert web stream to Node stream
    const nodeStream = Readable.fromWeb(stream);

    // Set correct content type for RSC
    res.setHeader("Content-Type", "text/x-component");

    // Pipe directly to response
    nodeStream.pipe(res);
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3002, async () => {
  await build();
  console.log("Listening on port 3002");
});
