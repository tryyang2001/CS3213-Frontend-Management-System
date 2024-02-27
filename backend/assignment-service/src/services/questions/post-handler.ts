import { CreateQuestionBody } from "../../libs/validators/questions/create-question-validator";
import { CreateQuestionReferenceSolutionBody } from "../../libs/validators/questions/create-reference-solution-validator";
import { CreateQuestionTestCasesBody } from "../../libs/validators/questions/create-test-cases-validator";
import db from "../../models/db";
import { Question } from "../../models/types/question";
import { ReferenceSolution } from "../../models/types/reference-solution";

const createQuestion = async (createQuestionBody: CreateQuestionBody) => {
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

  const createdQuestion = await db.question.findUnique({
    where: {
      id: question.id,
    },
  });

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
    id: createdQuestion!.id,
    title: createdQuestion!.title,
    description: createdQuestion!.description,
    deadline: createdQuestion!.deadline.getTime(),
    numberOfTestCases: createdQuestion!.numberOfTestCases,
    assignmentId: createdQuestion!.assignmentId
      ? createdQuestion!.assignmentId
      : undefined,
    referenceSolutionId: createdQuestion!.referenceSolutionId
      ? createdQuestion!.referenceSolutionId
      : undefined,
  };

  return questionDto;
};

const createQuestionReferenceSolution = async (
  createQuestionReferenceSolutionBody: CreateQuestionReferenceSolutionBody
) => {
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
) => {
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
