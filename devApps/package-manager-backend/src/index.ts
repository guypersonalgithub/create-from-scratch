import express from "express";
import cors from "cors";
import { loadFlagsIntoEnv } from "@packages/utils";

loadFlagsIntoEnv();

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("");
});

app.listen(process.env.PORT ?? 3000, async () => {
  console.log(`Listening on port ${process.env.PORT ?? 3000}`);
});
