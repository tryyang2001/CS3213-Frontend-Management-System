import express from "express";
import { AssignmentController } from "../controllers/assignment-controller";
import { QuestionController } from "../controllers/question-controller";

const router = express.Router();

router.route("/health").get(AssignmentController.getHealth);

router.route("/assignments/:id").get(AssignmentController.getAssignmentById);

router
  .route("/assignments/:id/questions")
  .get(AssignmentController.getAssignmentQuestionsById);

router
  .route("/questions/:id/solution")
  .get(QuestionController.getReferenceSolutionByQuestionId);

router
  .route("/questions/:id/solution")
  .post(QuestionController.createQuestionReferenceSolution);

router.route("/assignments").post(AssignmentController.createAssignment);

router.route("/assignments/:id").put(AssignmentController.updateAssignment);

export default router;
