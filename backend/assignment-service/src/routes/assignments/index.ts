import express from "express";
import { AssignmentController } from "../../controllers/assignment-controller";

const router = express.Router();

router.route("/assignments").get(AssignmentController.getAssignmentsByUserId);

router.route("/assignments").post(AssignmentController.createAssignment);

router.route("/assignments/:id").get(AssignmentController.getAssignmentById);

router.route("/assignments/:id").put(AssignmentController.updateAssignmentById);

router
  .route("/assignments/:id")
  .delete(AssignmentController.deleteAssignmentById);

const assignmentRouter = router;

export default assignmentRouter;
