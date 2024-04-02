import { UpdateQuestionReferenceSolutionBody } from "../../libs/validators/questions/update-reference-solution-validator";
import { UpdateQuestionBody } from "../../libs/validators/questions/update-question-validator";
import db from "../../models/db";
import { Question } from "../../models/types/question";
import { ReferenceSolution } from "../../models/types/reference-solution";

const updateQuestionById = async (updateQuestionBody: UpdateQuestionBody) => {
  const updatedQuestion = await db.question.update({
    where: {
      id: updateQuestionBody.questionId,
    },
    data: {
      title: updateQuestionBody.title ? updateQuestionBody.title : undefined,
      description: updateQuestionBody.description
        ? updateQuestionBody.description
        : undefined,
      deadline: updateQuestionBody.deadline
        ? new Date(updateQuestionBody.deadline)
        : undefined,
    },
  });

  if (!updatedQuestion) {
    return null;
  }

  if (updateQuestionBody.deadline) {
    await db.assignment.update({
      where: {
        id: updatedQuestion.assignmentId!,
      },
      data: {
        deadline: new Date(updateQuestionBody.deadline),
      },
    });
  }

  const updatedQuestionDto: Question = {
    id: updatedQuestion.id,
    title: updatedQuestion.title,
    description: updatedQuestion.description,
    deadline: updatedQuestion.deadline.getTime(),
    numberOfTestCases: updatedQuestion.numberOfTestCases,
    referenceSolutionId: updatedQuestion.referenceSolutionId || undefined,
    assignmentId: updatedQuestion.assignmentId!,
  };

  return updatedQuestionDto;
};

const updateQuestionReferenceSolution = async (
  updateQuestionReferenceSolutionBody: UpdateQuestionReferenceSolutionBody
) => {
  const questionExists = await db.question.findUnique({
    where: {
      id: updateQuestionReferenceSolutionBody.id,
    },
    select: {
      id: true,
      referenceSolutionId: true,
    },
  });

  if (!questionExists || !questionExists.referenceSolutionId) {
    return null;
  }

  const updatedReferenceSolution = await db.referenceSolution.update({
    where: {
      id: questionExists.referenceSolutionId,
    },
    data: {
      language: updateQuestionReferenceSolutionBody.language,
      code: updateQuestionReferenceSolutionBody.code,
    },
  });

  const updatedReferenceSolutionDto: ReferenceSolution = {
    id: updatedReferenceSolution.id,
    language: updatedReferenceSolution.language,
    code: updatedReferenceSolution.code,
    questionId: updatedReferenceSolution.questionId,
  };

  return updatedReferenceSolutionDto;
};

export const PutHandler = {
  updateQuestionById,
  updateQuestionReferenceSolution,
};
