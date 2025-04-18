import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  let count = 0;

  const interval = setInterval(() => {
    count++;
    const message = `Chunk ${count} - ${new Date().toISOString()}\n`;
    res.write(message);

    if (count >= 10) {
      clearInterval(interval);
      res.end("Stream complete.\n");
    }
  }, 1000);
});

app.listen(3002, async () => {
  console.log("Listening on port 3002");
});
