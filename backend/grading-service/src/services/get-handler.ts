import db from "../models/db";

const getSubmissionById = async (submissionId: string) => {
  const submission = await db.submission.findUnique({
    where: {
      id: submissionId,
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
    },
  });

  if (!submission) {
    return null;
  }

  return {
    id: submission.id,
    questionId: submission.questionId,
    studentId: submission.studentId,
    language: submission.language,
    code: submission.code,
    feedbacks: submission.feedbacks.map((feedback) => {
      return {
        line: feedback.line,
        hints: feedback.hints,
      };
    }),
  };
};

const getSubmissionByQuestionIdAndStudentId = async (
  questionId: string,
  studentId: number
) => {
  const submission = await db.submission.findFirst({
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
    },
  });

  if (!submission) {
    return null;
  }

  return {
    id: submission.id,
    questionId: submission.questionId,
    studentId: submission.studentId,
    language: submission.language,
    code: submission.code,
    feedbacks: submission.feedbacks.map((feedback) => {
      return {
        line: feedback.line,
        hints: feedback.hints,
      };
    }),
  };
};

export const GetHandler = {
  getSubmissionById,
  getSubmissionByQuestionIdAndStudentId,
};
