import { Request, Response } from "express";
import { ITSApi } from "../services/its/api-wrapper";
import HttpStatusCode from "../libs/enums/HttpStatusCode";
import ITSPostParserError from "../libs/errors/ITSPostParserError";
import ITSPostFeedbackError from "../libs/errors/ITSPostFeedbackError";
import NotExistingReferencedSolutionError from "../libs/errors/NotExistingReferencedSolutionError";
import NotExistingTestCaseError from "../libs/errors/NotExistingTestCaseError";
import CodeFunctionNameError from "../libs/errors/CodeFunctionNameError";
import { GetHandler } from "../services/get-handler";
import { PostParserValidator } from "../libs/validators/post-parser-validator";
import { ZodError } from "zod";
import { formatZodErrorMessage } from "../libs/utils/error-utils";
import { PostFeedbackValidator } from "../libs/validators/post-feedback-validator";
import NotExistingStudentError from "../libs/errors/NotExistingStudentError";
import { GetSubmissionQueryValidator } from "../libs/validators/get-submission-query-validator";

const getSubmissionByQuestionIdAndStudentId = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { questionId } = request.params;
    const { studentId } = GetSubmissionQueryValidator.parse(request.query);

    const submission = await GetHandler.getSubmissionByQuestionIdAndStudentId(
      questionId,
      studentId
    );

    if (!submission) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "No submission found",
      });

      return;
    }

    response.status(HttpStatusCode.OK).json(submission);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: formatZodErrorMessage(error),
      });

      return;
    }

    console.log(error);

    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

const postParser = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { language, source_code } = PostParserValidator.parse(request.body);

    const parser = await ITSApi.generateParserString(language, source_code);

    response.status(HttpStatusCode.OK).json({ parser });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: formatZodErrorMessage(error),
      });

      return;
    }

    if (error instanceof ITSPostParserError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid source_code. " + error.message,
      });

      return;
    }

    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

const postFeedback = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    // take in language, source_code, question_id, student_id
    const { language, source_code, question_id, student_id } =
      PostFeedbackValidator.parse(request.body);

    // call generateErrorFeedback from ITS API
    const errorFeedbacks = await ITSApi.generateErrorFeedback(
      language,
      source_code,
      question_id,
      student_id
    );

    response.status(HttpStatusCode.OK).json({
      hasError: errorFeedbacks.length > 0,
      feedbacks: errorFeedbacks,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: formatZodErrorMessage(error),
      });

      return;
    }

    if (
      error instanceof ITSPostParserError ||
      error instanceof CodeFunctionNameError
    ) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid source_code. " + error.message,
      });

      return;
    }

    if (
      error instanceof NotExistingReferencedSolutionError ||
      error instanceof NotExistingTestCaseError
    ) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "Invalid question_id. " + error.message,
      });

      return;
    }

    if (error instanceof ITSPostFeedbackError) {
      response.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({
        error: "UNPROCESSABLE ENTITY",
        message: "Invalid request. " + error.message,
      });

      return;
    }

    if (error instanceof NotExistingStudentError) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "Invalid student_id. " + error.message,
      });

      return;
    }

    console.log(error);

    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

export const GradingController = {
  getSubmissionByQuestionIdAndStudentId,
  postParser,
  postFeedback,
};
