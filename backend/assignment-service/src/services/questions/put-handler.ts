import { UpdateQuestionReferenceSolutionBody } from "../../libs/validators/questions/update-reference-solution-validator";
import { UpdateQuestionBody } from "../../libs/validators/questions/update-question-validator";
import db from "../../models/db";
import { Question } from "../../models/types/question";

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
    deadline: updatedQuestion.deadline
      ? updatedQuestion.deadline.getTime()
      : undefined,
    numberOfTestCases: updatedQuestion.numberOfTestCases,
    referenceSolutionId: updatedQuestion.referenceSolutionId || undefined,
    assignmentId: updatedQuestion.assignmentId || undefined,
  };

  return updatedQuestionDto;
};

const updateQuestionReferenceSolution = async (
  updateQuestionReferenceSolutionBody: UpdateQuestionReferenceSolutionBody
) => {
  const updatedReferenceSolution = await db.referenceSolution.update({
    where: {
      questionId: updateQuestionReferenceSolutionBody.id,
    },
    data: {
      language: updateQuestionReferenceSolutionBody.language
        ? updateQuestionReferenceSolutionBody.language
        : undefined,
      code: updateQuestionReferenceSolutionBody.code
        ? updateQuestionReferenceSolutionBody.code
        : undefined,
    },
  });

  // update question's referenceSolutionId
  await db.question.update({
    where: {
      id: updateQuestionReferenceSolutionBody.id,
    },
    data: {
      referenceSolutionId: updatedReferenceSolution.id,
    },
  });

  return updatedReferenceSolution;
};

export const PutHandler = {
  updateQuestionById,
  updateQuestionReferenceSolution,
};
