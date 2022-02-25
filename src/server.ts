import "reflect-metadata";

import express from "express";

import "./database";
import routes from "./routes";
import upload from "./config/upload";

const app = express();
app.use(express.json());
app.use("/files", express.static(upload.directory));
app.use(routes);

app.listen(3333, () => {
  console.log("Server listen on port 3333");
});
