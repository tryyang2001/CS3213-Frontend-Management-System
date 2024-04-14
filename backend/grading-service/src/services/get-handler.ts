import NotExistingStudentError from "../libs/errors/NotExistingStudentError";
import db from "../models/db";
import { Submission } from "../types/grading-service";

const getSubmissionsByQuestionIdAndStudentId = async (
  questionId: string,
  studentId: number
) => {
  // check if the user exists
  const student = await db.user.findUnique({
    where: {
      uid: studentId,
    },
  });

  if (!student) {
    throw new NotExistingStudentError(studentId);
  }

  const submissions = await db.submission.findMany({
    where: {
      questionId: questionId,
      studentId: studentId,
    },
    select: {
      id: true,
      questionId: true,
      studentId: true,
      language: true,
      code: true,
      feedbacks: {
        select: {
          line: true,
          hints: true,
        },
      },
      createdOn: true,
    },
    orderBy: {
      createdOn: "desc",
    },
  });

  return submissions.map((submission) => {
    return {
      ...submission,
      createdOn: submission.createdOn.getTime(),
    };
  });
};

const getLatestSubmissionByQuestionIdAndStudentId = async (
  questionId: string,
  studentId: number
): Promise<Submission | null> => {
  // check if the user exists
  const student = await db.user.findUnique({
    where: {
      uid: studentId,
    },
  });

  if (!student) {
    throw new NotExistingStudentError(studentId);
  }

  const latestSubmission = await db.submission.findFirst({
    where: {
      questionId: questionId,
      studentId: studentId,
    },
    select: {
      id: true,
      questionId: true,
      studentId: true,
      language: true,
      code: true,
      feedbacks: {
        select: {
          line: true,
          hints: true,
        },
      },
      createdOn: true,
    },
    orderBy: {
      createdOn: "desc",
    },
  });

  if (!latestSubmission) {
    return null;
  }

  return latestSubmission;
};

export const GetHandler = {
  getSubmissionsByQuestionIdAndStudentId,
  getLatestSubmissionByQuestionIdAndStudentId,
};
