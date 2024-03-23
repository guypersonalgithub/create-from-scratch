import express from "express";
import cors from "cors";
import { testing } from "@packages/test";
import { ReturnedData } from "@packages/shared-types";
import { getDateTime, initializePool } from "@packages/postgresql";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  const data: ReturnedData = {
    prop1: "test",
    prop2: testing(),
  };

  res.send(data);
});

app.listen(3002, async () => {
  console.log("Listening on port 3002");
  const client = initializePool();
  const time = await getDateTime({ pool: client });
  console.log(time);
});
