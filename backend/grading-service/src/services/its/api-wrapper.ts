import axios from "axios";
import dotenv from "dotenv";
import db from "../../models/db";
import ITSPostParserError from "../../libs/errors/ITSPostParserError";
import NotExistingReferencedSolutionError from "../../libs/errors/NotExistingReferencedSolutionError";
import NotExistingTestCaseError from "../../libs/errors/NotExistingTestCaseError";
import ITSPostFeedbackError from "../../libs/errors/ITSPostFeedbackError";
import { ErrorFeedback } from "../../models/its/error-feedback";

dotenv.config();

const api = axios.create({
  baseURL: process.env.ITS_API_URL,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "Grading Service",
    "Accept-Encoding": "gzip",
  },
});

const generateParserString = async (language: string, source_code: string) => {
  try {
    const response = await api.post("/cs3213/parser", {
      language: language,
      source_code: source_code,
    });

    const parser = response.data;

    const parserString = JSON.stringify(parser);

    return parserString;
  } catch (error) {
    if (error === typeof axios.AxiosError) {
      throw new ITSPostParserError();
    }

    throw error;
  }
};

const generateErrorFeedback = async (
  language: string,
  studentCode: string,
  questionId: string,
  studentId: string
) => {
  // obtain referenced solution parser
  const referencedSolution = await db.referenceSolution.findFirst({
    where: {
      questionId: questionId,
    },
  });

  if (!referencedSolution) {
    throw new NotExistingReferencedSolutionError();
  }

  const referencedSolutionParserString = referencedSolution.codeParser;
  if (!referencedSolution.codeParser) {
  }

  // obtain student solution parser
  const studentSolutionParserString = await generateParserString(
    language,
    studentCode
  );

  // get a test case
  const testCase = await db.testCase.findFirst({
    where: {
      questionId: questionId,
    },
  });

  if (!testCase) {
    throw new NotExistingTestCaseError();
  }

  // args
  const args = "[" + testCase.input + "]";

  // call ITS API to generate error feedback
  try {
    const response = await api.post("/cs3213/feedback", {
      language: language,
      referenced_solution: referencedSolutionParserString,
      student_solution: studentSolutionParserString,
      inputs: "[]",
      function: "",
      args: args,
    });

    const feedbacks = response.data as ErrorFeedback[];
  } catch (error) {
    if (error === typeof axios.AxiosError) {
      throw new ITSPostFeedbackError();
    }
  }
};

export const ITSApi = {
  generateParserString,
  generateErrorFeedback,
};
