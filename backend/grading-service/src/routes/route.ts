import { Router } from "express";
import { GradingController } from "../controllers/grading-controller";
import { BaseController } from "../controllers/base-controller";
import docsRouter from "./docs";

const router = Router();

router.get("/health", BaseController.getHealth);

router.post("/parser/generate", GradingController.postParser);

router.post("/feedback/generate", GradingController.postFeedback);

router.get(
  "/questions/:questionId/submissions",
  GradingController.getSubmissionByQuestionIdAndStudentId
);

router.use(docsRouter);

export default router;
