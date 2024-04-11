import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/user-route';
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

app.use("/user", userRoute);

app.listen(3001, () => {
    console.log("User microservice started on port 3001");
});

export default app;