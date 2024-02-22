import express from "express";
import cors from "../../middlewares/cors";
import bodyParser from "body-parser";
import router from "../../routes";
import HttpStatusCode from "../../libs/enums/HttpStatusCode";

export default function createUnitTestServer() {
  const app = express();

  app.use(cors);

  app.use(bodyParser.json());

  app.use("/assignment/api", router);

  app.all("*", (_, res) => {
    res.status(HttpStatusCode.NOT_FOUND).json({
      error: "NOT FOUND",
      message: "The requested resource was not found",
    });
  });

  return app;
}
