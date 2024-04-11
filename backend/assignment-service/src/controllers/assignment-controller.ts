import { Request, Response } from "express";
import HttpStatusCode from "../libs/enums/HttpStatusCode";
import { CreateAssignmentValidator } from "../libs/validators/assignments/create-assignment-validator";
import { ZodError } from "zod";
import { GetHandler } from "../services/assignments/get-handler";
import { PostHandler } from "../services/assignments/post-handler";
import { DeleteHandler } from "../services/assignments/delete-handler";
import { UpdateAssignmentValidator } from "../libs/validators/assignments/update-assignment-validator";
import { PutHandler } from "../services/assignments/put-handler";
import { formatZodErrorMessage } from "../libs/utils/error-message-utils";

const getAssignmentsByUserId = async (request: Request, response: Response) => {
  try {
    // obtain userId from the query param

    if (!request.query.userId) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "userId is required in the query params",
      });
      return;
    }

    const userId = parseInt(request.query.userId as string);

    if (isNaN(userId)) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid userId format",
      });
      return;
    }

    const assignments = await GetHandler.getAssignmentsByUserId(userId);

    if (!assignments) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "User not found",
      });
      return;
    }

    response.status(HttpStatusCode.OK).json(assignments);
  } catch (_error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

const getAssignmentById = async (request: Request, response: Response) => {
  try {
    const assignmentId = request.params.id;

    const assignment = await GetHandler.getAssignmentById(assignmentId);

    if (!assignment) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "Assignment not found",
      });
      return;
    }

    response.status(HttpStatusCode.OK).json(assignment);
  } catch (_error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

const createAssignment = async (request: Request, response: Response) => {
  try {
    // request body cannot be empty
    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is empty",
      });
      return;
    }

    const createAssignmentBody = CreateAssignmentValidator.parse(request.body);

    // request body must contain only the required fields
    if (
      Object.keys(createAssignmentBody).length !==
      Object.keys(request.body).length
    ) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body must contain only the required fields",
      });
      return;
    }

    const assignment = await PostHandler.createAssignment(createAssignmentBody);

    response.status(HttpStatusCode.CREATED).json(assignment);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: formatZodErrorMessage(error),
      });
      return;
    }

    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

const updateAssignmentById = async (request: Request, response: Response) => {
  try {
    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is empty",
      });
      return;
    }

    const assignmentId = request.params.id;
    const updateAssignmentBody = UpdateAssignmentValidator.parse({
      ...request.body,
      assignmentId,
    });

    if (
      Object.keys(updateAssignmentBody).length - 1 !==
      Object.keys(request.body).length
    ) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body must contain only the required fields",
      });
      return;
    }

    const assignment = await PutHandler.updateAssignment(updateAssignmentBody);

    if (!assignment) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "Assignment not found",
      });
      return;
    }

    response.status(HttpStatusCode.OK).json(assignment);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: formatZodErrorMessage(error),
      });
      return;
    }

    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

const deleteAssignmentById = async (request: Request, response: Response) => {
  try {
    const assignmentId = request.params.id;

    const assignment = await DeleteHandler.deleteAssignmentById(assignmentId);

    if (!assignment) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "Assignment not found",
      });
      return;
    }

    response.status(HttpStatusCode.NO_CONTENT).send();
  } catch (_error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

export const AssignmentController = {
  getAssignmentsByUserId,
  getAssignmentById,
  createAssignment,
  updateAssignmentById,
  deleteAssignmentById,
};
