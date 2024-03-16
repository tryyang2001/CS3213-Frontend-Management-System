import express from "express";
import { QuestionController } from "../../controllers/question-controller";

const router = express.Router();

router
  .route("/assignments/:id/questions")
  .post(QuestionController.createQuestion);

router.route("/questions/:questionId").get(QuestionController.getQuestionById);

router
  .route("/questions/:questionId")
  .put(QuestionController.updateQuestionById);

router
  .route("/questions/:questionId")
  .delete(QuestionController.deleteQuestionById);

router
  .route("/questions/:questionId/test-cases")
  .get(QuestionController.getQuestionTestCasesById);

router
  .route("/questions/:questionId/test-cases")
  .post(QuestionController.createQuestionTestCases);

router.route("/questions/:questionId/test-cases");

router
  .route("/questions/:questionId/solution")
  .get(QuestionController.getReferenceSolutionByQuestionId);

router
  .route("/questions/:questionId/solution")
  .post(QuestionController.createQuestionReferenceSolution);

const questionRouter = router;

export default questionRouter;
