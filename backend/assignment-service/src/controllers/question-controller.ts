import { Request, Response } from "express";
import HttpStatusCode from "../libs/enums/HttpStatusCode";
import { GetHandler } from "../services/get-handler";
import { PostHandler } from "../services/post-handler";
import { createQuestionReferenceSolutionValidator } from "../libs/validators/create-question-reference-solution-validator";
import db from "../models/db";
import { ZodError } from "zod";

const getReferenceSolutionByQuestionId = async (
  request: Request,
  response: Response
) => {
  try {
    const questionId = request.params.id;

    const referenceSolution = await GetHandler.getQuestionReferenceSolution(
      questionId
    );

    if (!referenceSolution) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "Reference solution not found",
      });
      return;
    }

    response.status(HttpStatusCode.OK).json(referenceSolution);
  } catch (error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has ocurred. Please try again later",
    });
  }
};

const createQuestionReferenceSolution = async (
  request: Request,
  response: Response
) => {
  try {
    const questionId = request.params.id;

    const createQuestionReferenceSolutionBody =
      createQuestionReferenceSolutionValidator.parse({
        ...request.body,
        id: questionId,
      });

    const isQuestionExists = await db.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!isQuestionExists) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "Question not found",
      });
      return;
    }

    const referenceSolution = await PostHandler.createQuestionReferenceSolution(
      createQuestionReferenceSolutionBody
    );

    response.status(HttpStatusCode.CREATED).json(referenceSolution);
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

export const QuestionController = {
  getReferenceSolutionByQuestionId,
  createQuestionReferenceSolution,
};
