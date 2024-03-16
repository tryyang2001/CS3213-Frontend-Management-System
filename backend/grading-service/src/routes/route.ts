import { Router } from "express";
import { GradingController } from "../controllers/grading-controller";

const router = Router();

router.post("/parser/generate", GradingController.postParser);

export default router;
