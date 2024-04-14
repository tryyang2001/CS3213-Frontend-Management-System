import db from "../../models/db";
import { Assignment } from "../../types/assignment";

const deleteAssignmentById = async (id: string): Promise<Assignment | null> => {
  const assignmentExists = await db.assignment.findUnique({
    where: {
      id: id,
    },
  });

  if (!assignmentExists) {
    return null;
  }

  const assignment = await db.assignment.delete({
    where: {
      id: id,
    },
  });

  const deletedAssignment: Assignment = {
    id: assignment.id,
    title: assignment.title,
    deadline: assignment.deadline.getTime(),
    description: assignment.description ?? undefined,
    isPublished: assignment.isPublished,
    numberOfQuestions: assignment.numberOfQuestions,
    authors: assignment.authors,
    createdOn: assignment.createdOn.getTime(),
    updatedOn: assignment.updatedOn.getTime(),
  };

  return deletedAssignment;
};

export const DeleteHandler = {
  deleteAssignmentById,
};
