import express from "express";
import { BaseController } from "../controllers/base-controller";
import assignmentRouter from "./assignments";
import questionRouter from "./questions";
import docsRouter from "./docs";

const router = express.Router();

router.route("/health").get(BaseController.getHealth);

router.use(assignmentRouter);

router.use(questionRouter);

router.use(docsRouter);

export default router;
