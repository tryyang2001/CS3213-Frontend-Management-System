import { CreateAssignmentBody } from "../libs/validators/create-assignment-validator";
import { CreateQuestionReferenceSolutionBody } from "../libs/validators/create-question-reference-solution-validator";
import db from "../models/db";
import { ReferenceSolution } from "../models/types/reference-solution";

const createAssignment = async (createAssignmentBody: CreateAssignmentBody) => {
  // convert deadline to Date object
  const deadlines = createAssignmentBody.questions.map(
    (question) => new Date(question.deadline)
  );

  // find the latest deadline as the assignment deadline
  const assignmentDeadline = new Date(
    Math.max(...deadlines.map((deadline) => deadline.getTime()))
  );

  const assignment = await db.assignment.create({
    data: {
      title: createAssignmentBody.title,
      deadline: assignmentDeadline,
      authors: createAssignmentBody.authors,
      questions: {
        create: createAssignmentBody.questions.map((question, index) => {
          return {
            title: question.title,
            description: question.description,
            deadline: deadlines[index],
            examples: {
              create: question.examples,
            },
            constraints: question.constraints || [],
          };
        }),
      },
    },
  });

  const questions = createAssignmentBody.questions.map((question) => {
    return {
      title: question.title,
      description: question.description,
      deadline: question.deadline,
      examples: question.examples,
      constraints: question.constraints || [],
    };
  });

  const assignmentDto = {
    id: assignment.id,
    title: assignment.title,
    deadline: assignment.deadline.getTime(),
    questions: questions,
    authors: assignment.authors,
    createdOn: assignment.createdOn.getTime(),
    updatedOn: assignment.updatedOn.getTime(),
  };

  return assignmentDto;
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

export const PostHandler = {
  createAssignment,
  createQuestionReferenceSolution,
};
