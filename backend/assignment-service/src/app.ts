import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "./middlewares/cors";
import router from "./routes";
import HttpStatusCode from "./libs/enums/HttpStatusCode";

dotenv.config();

const app = express();

// middleware
app.use(cors);

app.use(bodyParser.json());

app.use("/assignment/api", router);

app.all("*", (req, res) => {
  res.status(HttpStatusCode.NOT_FOUND).json({
    error: "NOT FOUND",
    message: "The requested resource was not found",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Assignment Service is running on port ${PORT}`);
  console.log(
    `Swagger API documentation is available at http://localhost:${PORT}/assignment/api/docs`
  );
});
