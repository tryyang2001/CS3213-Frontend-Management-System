import DuplicateReferenceSolutionError from "../../libs/errors/DuplicateReferenceSolutionError";
import { CreateQuestionBody } from "../../libs/validators/questions/create-question-validator";
import { CreateQuestionReferenceSolutionBody } from "../../libs/validators/questions/create-reference-solution-validator";
import { CreateQuestionTestCasesBody } from "../../libs/validators/questions/create-test-cases-validator";
import db from "../../models/db";
import { Question } from "../../types/question";
import { ReferenceSolution } from "../../types/reference-solution";

const createQuestion = async (
  createQuestionBody: CreateQuestionBody
): Promise<Question | null> => {
  // check if assignment exists
  const assignment = await db.assignment.findUnique({
    where: {
      id: createQuestionBody.assignmentId,
    },
  });

  if (!assignment) {
    return null;
  }

  const question = await db.question.create({
    data: {
      title: createQuestionBody.title,
      description: createQuestionBody.description,
      deadline: new Date(createQuestionBody.deadline),
      assignmentId: createQuestionBody.assignmentId,
      testCases: {
        create: createQuestionBody.testCases?.map((testCase) => {
          return {
            input: testCase.input,
            output: testCase.output,
            isPublic: testCase.isPublic,
          };
        }),
      },
      numberOfTestCases: createQuestionBody.testCases?.length,
      referenceSolution: {
        create: createQuestionBody.referenceSolution,
      },
    },
    include: {
      referenceSolution: true,
    },
  });

  // manually assign referenceSolutionId to question
  if (question.referenceSolution) {
    await db.question.update({
      where: {
        id: question.id,
      },
      data: {
        referenceSolutionId: question.referenceSolution.id,
      },
    });
  }

  await db.assignment.update({
    where: {
      id: createQuestionBody.assignmentId,
    },
    data: {
      numberOfQuestions: {
        increment: 1,
      },
    },
  });

  const questionDto: Question = {
    id: question.id,
    title: question.title,
    description: question.description,
    deadline: question.deadline.getTime(),
    numberOfTestCases: question.numberOfTestCases,
    assignmentId: question.assignmentId ? question.assignmentId : undefined,
    referenceSolutionId: question.referenceSolution
      ? question.referenceSolution.id
      : undefined,
    createdOn: question.createdOn.getTime(),
  };

  return questionDto;
};

const createQuestionReferenceSolution = async (
  createQuestionReferenceSolutionBody: CreateQuestionReferenceSolutionBody
): Promise<ReferenceSolution | null> => {
  const questionExists = await db.question.findUnique({
    where: {
      id: createQuestionReferenceSolutionBody.id,
    },
  });

  if (!questionExists) {
    return null;
  }

  if (questionExists.referenceSolutionId) {
    throw new DuplicateReferenceSolutionError(questionExists.id);
  }

  const referenceSolution = await db.referenceSolution.create({
    data: {
      questionId: createQuestionReferenceSolutionBody.id,
      language: createQuestionReferenceSolutionBody.language,
      code: createQuestionReferenceSolutionBody.code,
    },
  });

  await db.question.update({
    where: {
      id: createQuestionReferenceSolutionBody.id,
    },
    data: {
      referenceSolutionId: referenceSolution.id,
    },
  });

  const referenceSolutionDto: ReferenceSolution = {
    id: referenceSolution.id,
    questionId: referenceSolution.questionId,
    language: referenceSolution.language,
    code: referenceSolution.code,
  };

  return referenceSolutionDto;
};

const createQuestionTestCases = async (
  createQuestionTestCasesBody: CreateQuestionTestCasesBody
): Promise<{
  count: number;
  testCases: {
    input: string;
    output: string;
    isPublic?: boolean;
  }[];
} | null> => {
  const questionExists = await db.question.findUnique({
    where: {
      id: createQuestionTestCasesBody.questionId,
    },
  });

  if (!questionExists) {
    return null;
  }

  const testCasesCreationResponse = await db.testCase.createMany({
    data: createQuestionTestCasesBody.testCases.map((testCase) => {
      return {
        questionId: createQuestionTestCasesBody.questionId,
        input: testCase.input,
        output: testCase.output,
        isPublic: testCase.isPublic,
      };
    }),
  });

  await db.question.update({
    where: {
      id: createQuestionTestCasesBody.questionId,
    },
    data: {
      numberOfTestCases: {
        increment: testCasesCreationResponse.count,
      },
    },
  });

  return {
    count: testCasesCreationResponse.count,
    testCases: createQuestionTestCasesBody.testCases,
  };
};

export const PostHandler = {
  createQuestion,
  createQuestionReferenceSolution,
  createQuestionTestCases,
};
