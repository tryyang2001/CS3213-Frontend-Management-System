import express, { Express, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "./middlewares/cors";
import HttpStatusCode from "./libs/enums/HttpStatusCode";
import router from "./routes/route";

dotenv.config();

const app: Express = express();

// implement cors for CORS protection
app.use(cors);

// implement body-parser for parsing request body
app.use(bodyParser.json());

app.use("/grading/api", router);

app.all("*", (_, res: Response) => {
  res.status(HttpStatusCode.NOT_FOUND).json({
    error: "NOT FOUND",
    message: "The requested resource could not be found.",
  });
});

const PORT = process.env.PORT || 8088;
// console.log(process.env.ITS_API_URL);

app.listen(PORT, async () => {
  console.log("Grading Service is running on port 8088.");
});
