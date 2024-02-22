import db from "../models/db";
import { Assignment } from "../models/types/assignment";
import { Question } from "../models/types/question";
import { ReferenceSolution } from "../models/types/reference-solution";

const getAssignmentById = async (id: string) => {
  const assignment = await db.assignment.findUnique({
    where: {
      id: id,
    },
  });

  if (!assignment) {
    return null;
  }

  const questions = await db.question.findMany({
    where: {
      assignmentId: id,
    },
  });

  const questionsDto: Question[] = questions.map((question) => {
    return {
      id: question.id,
      title: question.title,
      description: question.description,
      deadline: question.deadline.getTime(),
      examples: [],
      constraints: question.constraints,
      referenceSolutionId: question.referenceSolutionId,
    };
  });

  for (let i = 0; i < questionsDto.length; i++) {
    const examples = await db.questionExample.findMany({
      where: {
        questionId: questionsDto[i].id,
      },
    });

    if (examples.length > 0) {
      questionsDto[i].examples = examples.map((example) => {
        return {
          input: example.input,
          output: example.output,
          explanation: example.explanation,
        };
      });
    }
  }

  const assignmentDto: Assignment = {
    id: assignment.id,
    title: assignment.title,
    deadline: assignment.deadline.getTime(),
    questions: questionsDto,
    authors: assignment.authors,
    createdOn: assignment.createdOn.getTime(),
    updatedOn: assignment.updatedOn.getTime(),
  };

  return assignmentDto;
};

const getAssignmentQuestions = async (id: string) => {
  const assignment = await db.assignment.findUnique({
    where: {
      id: id,
    },
    select: {
      questions: {
        select: {
          id: true,
          title: true,
          description: true,
          deadline: true,
          examples: {
            select: {
              input: true,
              output: true,
              explanation: true,
            },
          },
          constraints: true,
          referenceSolutionId: true,
        },
      },
    },
  });

  if (!assignment) {
    return null;
  }

  const questionsDto: Question[] = assignment.questions.map((question) => {
    return {
      id: question.id,
      title: question.title,
      description: question.description,
      deadline: question.deadline.getTime(),
      examples: question.examples.map((example) => {
        return {
          input: example.input,
          output: example.output,
          explanation: example.explanation,
        };
      }),
      constraints: question.constraints,
      referenceSolutionId: question.referenceSolutionId,
    };
  });

  return questionsDto;
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

export const GetHandler = {
  getAssignmentById,
  getAssignmentQuestions,
  getQuestionReferenceSolution,
};
