import db from "../../models/db";
import { Assignment } from "../../models/types/assignment";
import { Question } from "../../models/types/question";

const getAssignmentsByUserId = async (
  userId: number,
  includePast?: boolean,
  isPublishedOnly?: boolean
) => {
  // check if the user exists
  const user = await db.user.findUnique({
    where: {
      uid: userId,
    },
  });

  if (!user) {
    return null;
  }

  const assignments = await db.assignment.findMany({
    where: {
      isPublished: isPublishedOnly ? true : undefined,
      deadline: includePast
        ? undefined
        : {
            gt: new Date(),
          },
    },
  });

  const assignmentsDto: Assignment[] = assignments.map((assignment) => {
    return {
      id: assignment.id,
      title: assignment.title,
      deadline: assignment.deadline.getTime(),
      authors: assignment.authors,
      isPublished: assignment.isPublished,
      numberOfQuestions: assignment.numberOfQuestions,
      createdOn: assignment.createdOn.getTime(),
      updatedOn: assignment.updatedOn.getTime(),
    };
  });

  return assignmentsDto;
};

const getAssignmentById = async (id: string) => {
  const assignment = await db.assignment.findUnique({
    where: {
      id: id,
    },
    include: {
      questions: true,
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
      numberOfTestCases: question.numberOfTestCases,
      referenceSolutionId: question.referenceSolutionId
        ? question.referenceSolutionId
        : undefined,
      createdOn: question.createdOn.getTime(),
    };
  });

  const assignmentDto: Assignment = {
    id: assignment.id,
    title: assignment.title,
    deadline: assignment.deadline.getTime(),
    description: assignment.description ?? undefined,
    isPublished: assignment.isPublished,
    numberOfQuestions: assignment.numberOfQuestions,
    questions: questionsDto,
    authors: assignment.authors,
    createdOn: assignment.createdOn.getTime(),
    updatedOn: assignment.updatedOn.getTime(),
  };

  return assignmentDto;
};

export const GetHandler = {
  getAssignmentsByUserId,
  getAssignmentById,
};
