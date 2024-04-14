import express, { Application } from "express";
import cookieParser from "cookie-parser";
import userRoute from "../../routes/user/user-route";

export default function createUnitTestServer(): Application {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use("/user", userRoute);

  return app;
}
