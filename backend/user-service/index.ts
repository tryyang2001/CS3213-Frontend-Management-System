import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes';
import HttpStatusCode from "./libs/enums/HttpStatusCode";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
      credentials: true,
      origin: true,
      optionsSuccessStatus: 200,
    })
  );

app.get("/", (req, res) => {
    res.json("Connected to user microservice");
});

app.use("/user", router);

app.listen(3001, () => {
  console.log("User microservice started on port 3001");
  console.log(
    `Swagger API documentation is available at http://localhost:3001/user/docs`
  );
});

export default app;