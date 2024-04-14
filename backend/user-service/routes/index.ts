import express from "express";
import userRouter from "./user/user-route";
import docsRouter from "./docs/doc-route";

const router = express.Router();

router.use(userRouter);

router.use(docsRouter);

router.use(docsRouter);

export default router;
