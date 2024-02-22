import db from "../../models/db";
import { Question } from "../../models/types/question";
import { ReferenceSolution } from "../../models/types/reference-solution";
import { TestCase } from "../../models/types/test-case";

const getQuestionById = async (questionId: string) => {
  const question = await db.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      testCases: {
        select: {
          id: true,
          input: true,
          output: true,
          isPublic: true,
        },
      },
    },
  });

  if (!question) {
    return null;
  }

  const questionDto: Question = {
    id: question.id,
    title: question.title,
    description: question.description,
    deadline: question.deadline.getTime(),
    numberOfTestCases: question.numberOfTestCases,
    testCases: question.testCases,
    assignmentId: question.assignmentId ? question.assignmentId : undefined,
    referenceSolutionId: question.referenceSolutionId
      ? question.referenceSolutionId
      : undefined,
  };

  return questionDto;
};

const getQuestionReferenceSolution = async (questionId: string) => {
  const referenceSolution = await db.referenceSolution.findFirst({
    where: {
      questionId: questionId,
    },
  });

  if (!referenceSolution) {
    return null;
  }

  const referenceSolutionDto: ReferenceSolution = {
    id: referenceSolution.id,
    language: referenceSolution.language,
    code: referenceSolution.code,
    questionId: questionId,
  };

  return referenceSolutionDto;
};

const getQuestionTestCases = async (questionId: string) => {
  const testCases = await db.testCase.findMany({
    where: {
      questionId: questionId,
    },
    select: {
      id: true,
      input: true,
      output: true,
      isPublic: true,
    },
  });

  if (!testCases || testCases.length === 0) {
    return null;
  }

  const testCasesDto = testCases.map((testCase) => {
    return {
      id: testCase.id,
      input: testCase.input,
      output: testCase.output,
      isPublic: testCase.isPublic,
    } as TestCase;
  });

  return testCasesDto;
};

export const GetHandler = {
  getQuestionById,
  getQuestionReferenceSolution,
  getQuestionTestCases,
};
