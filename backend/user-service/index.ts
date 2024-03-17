import express from 'express';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user-route';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json("Connected to user microservice");
});

app.use("/user", userRoute);

app.listen(3001, () => {
    console.log("User microservice started on port 3001");
});

export default app;