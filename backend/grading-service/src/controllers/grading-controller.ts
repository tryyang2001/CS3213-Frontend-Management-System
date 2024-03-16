import { Request, Response } from "express";
import { ITSApi } from "../services/its/api-wrapper";
import HttpStatusCode from "../libs/enums/HttpStatusCode";
import ITSPostParserError from "../libs/errors/ITSPostParserError";
import ITSPostFeedbackError from "../libs/errors/ITSPostFeedbackError";
import NotExistingReferencedSolutionError from "../libs/errors/NotExistingReferencedSolutionError";
import NotExistingTestCaseError from "../libs/errors/NotExistingTestCaseError";
import CodeFunctionNameError from "../libs/errors/CodeFunctionNameError";
import { GetHandler } from "../services/get-handler";

const getSubmissionByQuestionIdAndStudentId = async (
  request: Request,
  response: Response
) => {
  try {
    const { questionId } = request.params;
    const { studentId } = request.query;

    if (!studentId) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Missing studentId in query.",
      });

      return;
    }

    const submission = await GetHandler.getSubmissionByQuestionIdAndStudentId(
      questionId,
      parseInt(studentId as string)
    );

    if (!submission) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "No submission found.",
      });

      return;
    }

    response.status(HttpStatusCode.OK).json(submission);
  } catch (error) {
    console.log(error);

    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

const postParser = async (request: Request, response: Response) => {
  try {
    const { language, source_code } = request.body;
    const parser = await ITSApi.generateParserString(language, source_code);

    if (!parser) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "The request could not be processed.",
      });

      return;
    }

    response.status(HttpStatusCode.OK).json({ parser });
  } catch (error) {
    console.log(error);

    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

const postFeedback = async (request: Request, response: Response) => {
  try {
    // take in language, source_code, question_id, student_id
    const { language, source_code, question_id, student_id } = request.body;

    // parse language
    var parsedLanguage = "";
    switch (language.toLowerCase()) {
      case "python" || "py":
        parsedLanguage = "py";
        break;
      case "c":
        parsedLanguage = "c";
        break;
      default:
        response.status(HttpStatusCode.BAD_REQUEST).json({
          error: "BAD REQUEST",
          message: 'Language not supported. (Only "py" and "c" are supported)',
        });
        return;
    }

    // call generateErrorFeedback from ITS API
    const errorFeedback = await ITSApi.generateErrorFeedback(
      parsedLanguage,
      source_code,
      question_id,
      student_id
    );

    response.status(HttpStatusCode.OK).json(errorFeedback);
  } catch (error) {
    if (error instanceof ITSPostFeedbackError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "The request could not be processed in ITS API.",
      });

      return;
    }

    if (error instanceof ITSPostParserError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message:
          "Invalid source code. Please check the input source_code and try again.",
      });

      return;
    }

    if (error instanceof NotExistingReferencedSolutionError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "The question_id does not exist.",
      });

      return;
    }

    if (error instanceof NotExistingTestCaseError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message:
          "The question_id does not have any test cases supported, please manually add input arguments to the test function.",
      });

      return;
    }

    if (error instanceof CodeFunctionNameError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message:
          "The source code does not contain the target function. Please check the input source_code and try again.",
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
