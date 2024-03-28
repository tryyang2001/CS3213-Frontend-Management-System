import db from "../../models/db";

const deleteQuestion = async (questionId: string) => {
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

  return question;
};

const deleteQuestionReferenceSolution = async (questionId: string) => {
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
) => {
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
