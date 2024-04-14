import axios from "axios";
import dotenv from "dotenv";
import db from "../../models/db";
import ITSPostParserError from "../../libs/errors/ITSPostParserError";
import NotExistingReferencedSolutionError from "../../libs/errors/NotExistingReferencedSolutionError";
import NotExistingTestCaseError from "../../libs/errors/NotExistingTestCaseError";
import ITSPostFeedbackError from "../../libs/errors/ITSPostFeedbackError";
import CodeFunctionNameError from "../../libs/errors/CodeFunctionNameError";
import HttpStatusCode from "../../libs/enums/HttpStatusCode";
import NotExistingStudentError from "../../libs/errors/NotExistingStudentError";
import { Feedback } from "../../types/grading-service";

dotenv.config();

export const api = axios.create({
  baseURL: process.env.ITS_API_URL,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "Grading Service",
    "Accept-Encoding": "gzip",
  },
});

async function generateParserString(
  language: string,
  source_code: string
): Promise<string> {
  try {
    const response = await api.post("/cs3213/parser", {
      language: language,
      source_code: source_code,
    });

    const parser = response.data;

    const parserString = JSON.stringify(parser);

    if (!parserString) throw new Error();

    return parserString;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case HttpStatusCode.UNPROCESSABLE_ENTITY:
          throw new ITSPostParserError("language");
        default:
          throw new ITSPostParserError("source_code");
      }
    }

    throw error;
  }
}

async function generateErrorFeedback(
  language: string,
  studentCode: string,
  questionId: string,
  studentId: number
): Promise<Feedback[]> {
  // ensure that student exists
  const student = await db.user.findUnique({
    where: {
      uid: studentId,
    },
  });

  if (!student) {
    throw new NotExistingStudentError(studentId);
  }

  // obtain referenced solution parser
  const referencedSolution = await db.referenceSolution.findFirst({
    where: {
      questionId: questionId,
      language: language === "py" ? "python" : language,
    },
  });

  if (!referencedSolution) {
    throw new NotExistingReferencedSolutionError();
  }

  let referencedSolutionParserString = referencedSolution.codeParser as string;

  if (!referencedSolution.codeParser) {
    referencedSolutionParserString = await ITSApi.generateParserString(
      referencedSolution.language,
      referencedSolution.code
    );

    // write back to database
    await db.referenceSolution.update({
      where: {
        id: referencedSolution.id,
      },
      data: {
        codeParser: referencedSolutionParserString,
      },
    });
  }

  // obtain the target function name
  const targetFunction = Object.keys(
    JSON.parse(referencedSolutionParserString).fncs
  )[0];

  // obtain student solution parser
  const studentSolutionParserString = await ITSApi.generateParserString(
    language,
    studentCode
  );

  // check if the student solution has the target function
  if (!JSON.parse(studentSolutionParserString).fncs[targetFunction]) {
    throw new CodeFunctionNameError(targetFunction);
  }

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
    const response = await api.post("/cs3213/feedback_error", {
      language: language,
      reference_solution: referencedSolutionParserString,
      student_solution: studentSolutionParserString,
      inputs: "[]",
      function: targetFunction,
      args: args,
    });

    const feedbacks: Feedback[] = response.data.map(
      (feedback: { lineNumber: number; hintStrings: string[] }) => {
        return {
          line: feedback.lineNumber,
          hints: feedback.hintStrings,
        };
      }
    );

    // write to Submission table
    await saveSubmissionWithFeedbacks(
      questionId,
      studentId,
      language,
      studentCode,
      studentSolutionParserString,
      feedbacks
    );

    return feedbacks;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ITSPostFeedbackError();
    }

    throw error;
  }
}

export const ITSApi = {
  generateParserString,
  generateErrorFeedback,
};

/**
 * Hepler function to save feedbacks to database
 */
async function saveSubmissionWithFeedbacks(
  questionId: string,
  studentId: number,
  language: string,
  studentCode: string,
  studentSolutionParserString: string,
  feedbacks: Feedback[]
): Promise<void> {
  // if the submission already exists, delete it
  const existingSubmission = await db.submission.findFirst({
    where: {
      questionId: questionId,
      studentId: studentId,
    },
  });

  if (existingSubmission) {
    await db.submission.delete({
      where: {
        id: existingSubmission.id,
      },
    });
  }

  const submission = await db.submission.create({
    data: {
      questionId: questionId,
      studentId: studentId,
      language: language === "py" ? "python" : language,
      code: studentCode,
      codeParser: studentSolutionParserString,
    },
  });

  // write to Feedback table
  await db.feedback.createMany({
    data: feedbacks.map((feedback) => {
      return {
        submissionId: submission.id,
        line: feedback.line,
        hints: feedback.hints,
      };
    }),
  });
}
