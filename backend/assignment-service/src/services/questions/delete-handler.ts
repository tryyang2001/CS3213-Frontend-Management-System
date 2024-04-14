import db from "../../models/db";
import { Question } from "../../types/question";
import { ReferenceSolution } from "../../types/reference-solution";
import { Prisma } from "@prisma/client";

const deleteQuestion = async (questionId: string): Promise<Question | null> => {
  const questionExists = await db.question.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!questionExists) {
    return null;
  }

  const question = await db.question.delete({
    where: {
      id: questionId,
    },
  });

  // update the number of questions in the assignment
  await db.assignment.update({
    where: {
      id: question.assignmentId!,
    },
    data: {
      numberOfQuestions: {
        decrement: 1,
      },
    },
  });

  const deletedQuestion: Question = {
    id: question.id,
    title: question.title,
    description: question.description ?? undefined,
    numberOfTestCases: question.numberOfTestCases,
    createdOn: question.createdOn.getTime(),
  };

  return deletedQuestion;
};

const deleteQuestionReferenceSolution = async (
  questionId: string
): Promise<ReferenceSolution | null> => {
  const questionExists = await db.question.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!questionExists) {
    return null;
  }

  const solutionExists = await db.referenceSolution.findFirst({
    where: {
      questionId: questionId,
    },
  });

  if (!solutionExists) {
    return null;
  }

  const referenceSolution = await db.referenceSolution.delete({
    where: {
      questionId: questionId,
    },
  });

  // remove referenceSolutionId from question
  await db.question.update({
    where: {
      id: questionId,
    },
    data: {
      referenceSolutionId: null,
    },
  });

  return referenceSolution;
};

const deleteQuestionTestCases = async (
  questionId: string,
  testCaseIds: string[]
): Promise<Prisma.BatchPayload | null> => {
  const questionExists = await db.question.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!questionExists) {
    return null;
  }

  const deletedTestCases = await db.testCase.deleteMany({
    where: {
      questionId: questionId,
      id: {
        in: testCaseIds,
      },
    },
  });

  if (deletedTestCases.count === 0) {
    return null;
  }

  await db.question.update({
    where: {
      id: questionId,
    },
    data: {
      numberOfTestCases: {
        decrement: deletedTestCases.count,
      },
    },
  });

  return deletedTestCases;
};

export const DeleteHandler = {
  deleteQuestion,
  deleteQuestionReferenceSolution,
  deleteQuestionTestCases,
};
