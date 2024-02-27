import db from "../../models/db";

const deleteQuestion = async (questionId: string) => {
  const question = await db.question.delete({
    where: {
      id: questionId,
    },
  });

  return question;
};

const deleteQuestionReferenceSolution = async (questionId: string) => {
  const referenceSolution = await db.referenceSolution.deleteMany({
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
