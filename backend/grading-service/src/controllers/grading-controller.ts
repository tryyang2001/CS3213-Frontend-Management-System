import { Request, Response } from "express";
import { ITSApi } from "../services/its/api-wrapper";
import HttpStatusCode from "../libs/enums/HttpStatusCode";

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
          message: "The request could not be processed.",
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
    console.log(error);

    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred. Please try again later",
    });
  }
};

export const GradingController = {
  postParser,
};
