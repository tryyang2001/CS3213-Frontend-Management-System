import express from 'express';
import cookieParser from 'cookie-parser';
import userRoute from '../../routes/user/user-route';

export default function createUnitTestServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  
  app.use("/user", userRoute);

  return app;
}
