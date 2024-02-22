import { Request, Response } from "express";
import db from "../models/db";
import HttpStatusCode from "../libs/enums/HttpStatusCode";
import { GetHandler } from "../services/get-handler";
import { CreateAssignmentValidator } from "../libs/validators/create-assignment-validator";
import { PostHandler } from "../services/post-handler";
import { ZodError } from "zod";
import { createQuestionReferenceSolutionValidator } from "../libs/validators/create-question-reference-solution-validator";

const getHealth = async (_: Request, response: Response) => {
  try {
    const result = await db.$queryRaw`SELECT 1`;

    if (!result) {
      throw new Error("No database connection from the server");
    }

    response.status(HttpStatusCode.OK).json({ message: "Healthy" });
  } catch (error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "No database connection from the server",
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
  } catch (error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has ocurred. Please try again later",
    });
  }
};

const getAssignmentQuestionsById = async (
  request: Request,
  response: Response
) => {
  try {
    const assignmentId = request.params.id;

    const questions = await GetHandler.getAssignmentQuestions(assignmentId);

    if (!questions || questions.length === 0) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "Questions not found",
      });
      return;
    }

    response.status(HttpStatusCode.OK).json(questions);
  } catch (error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has ocurred. Please try again later",
    });
  }
};

const createAssignment = async (request: Request, response: Response) => {
  try {
    if (!request.body) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is empty",
      });
      return;
    }

    const createAssignmentBody = CreateAssignmentValidator.parse(request.body);

    const assignment = await PostHandler.createAssignment(createAssignmentBody);

    response.status(HttpStatusCode.CREATED).json(assignment);
  } catch (error) {
    console.log(error);

    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: error.message,
      });
      return;
    }
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has ocurred. Please try again later",
    });
  }
};

const updateAssignment = async (request: Request, response: Response) => {};

export const AssignmentController = {
  getHealth,
  getAssignmentById,
  getAssignmentQuestionsById,
  createAssignment,
  updateAssignment,
};
