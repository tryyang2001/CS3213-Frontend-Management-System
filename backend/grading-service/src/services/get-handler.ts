import db from "../models/db";
import { Submission } from "../types/grading-service";

const getSubmissionByQuestionIdAndStudentId = async (
  questionId: string,
  studentId: number
): Promise<Submission | null> => {
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
      createdOn: true,
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
    feedbacks: submission.feedbacks.map(
      (feedback: { line: number; hints: string[] }) => {
        return {
          line: feedback.line,
          hints: feedback.hints,
        };
      }
    ),
    createdOn: submission.createdOn.getTime(),
  };
};

export const GetHandler = {
  getSubmissionByQuestionIdAndStudentId,
};
