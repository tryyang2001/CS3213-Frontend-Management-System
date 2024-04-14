import express from "express";
import cors from "../../middlewares/cors";
import bodyParser from "body-parser";
import router from "../../routes";

export default function createUnitTestServer(): express.Application {
  const app = express();

  app.use(cors);

  app.use(bodyParser.json());

  app.use("/assignment/api", router);

  return app;
}
