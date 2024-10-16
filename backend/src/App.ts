import express from "express";
import cors from "cors";

export const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send();
});
