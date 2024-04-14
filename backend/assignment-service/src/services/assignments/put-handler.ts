import { UpdateAssignmentBody } from "../../libs/validators/assignments/update-assignment-validator";
import db from "../../models/db";
import { Assignment } from "../../types/assignment";

const updateAssignment = async (updateAssignmentBody: UpdateAssignmentBody) => {
  const updatedAssignment = await db.assignment.update({
    where: {
      id: updateAssignmentBody.assignmentId,
    },
    data: {
      title: updateAssignmentBody.title,
      authors: updateAssignmentBody.authors,
      isPublished: updateAssignmentBody.isPublished,
      description: updateAssignmentBody.description,
      deadline: updateAssignmentBody.deadline
        ? new Date(updateAssignmentBody.deadline)
        : undefined,
    },
  });

  if (!updatedAssignment) {
    return null;
  }

  const updatedAssignmentDto: Assignment = {
    id: updatedAssignment.id,
    title: updatedAssignment.title,
    deadline: updatedAssignment.deadline.getTime(),
    isPublished: updatedAssignment.isPublished,
    description: updatedAssignment.description ?? undefined,
    numberOfQuestions: updatedAssignment.numberOfQuestions,
    authors: updatedAssignment.authors,
    createdOn: updatedAssignment.createdOn.getTime(),
    updatedOn: updatedAssignment.updatedOn.getTime(),
  };

  return updatedAssignmentDto;
};

export const PutHandler = {
  updateAssignment,
};
