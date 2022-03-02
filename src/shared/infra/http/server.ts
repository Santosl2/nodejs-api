import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";

import routes from "./routes";
import "../typeorm";

import cors from "cors";

import upload from "@config/upload";

import "@shared/container";
import AppError from "@shared/errors/AppError";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/files", express.static(upload.uploadsFolder));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

app.listen(3333, () => {
  console.log("Server listen on port 3333");
});
