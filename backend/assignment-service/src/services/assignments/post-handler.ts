import { CreateAssignmentBody } from "../../libs/validators/assignments/create-assignment-validator";
import db from "../../models/db";
import { Assignment } from "../../models/types/assignment";

const createAssignment = async (createAssignmentBody: CreateAssignmentBody) => {
  // convert deadline to Date object
  const assignment = await db.assignment.create({
    data: {
      title: createAssignmentBody.title,
      deadline: new Date(createAssignmentBody.deadline),
      description: createAssignmentBody.description,
      authors: createAssignmentBody.authors,
      isPublished: createAssignmentBody.isPublished,
    },
  });

  const assignmentDto: Assignment = {
    id: assignment.id,
    title: assignment.title,
    deadline: assignment.deadline.getTime(),
    description: assignment.description ?? undefined,
    authors: assignment.authors,
    isPublished: assignment.isPublished,
    numberOfQuestions: assignment.numberOfQuestions,
    createdOn: assignment.createdOn.getTime(),
    updatedOn: assignment.updatedOn.getTime(),
  };

  return assignmentDto;
};

export const PostHandler = {
  createAssignment,
};
