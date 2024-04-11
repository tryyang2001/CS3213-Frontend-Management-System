import { CreateAssignmentBody } from "../../../../libs/validators/assignments/create-assignment-validator";

export const getCreateAssignmentRequestBody = (): CreateAssignmentBody => {
  return {
    title: "Assignment 1",
    deadline: new Date("2024-12-31T23:59:59.999Z").getTime(),
    authors: [1],
    isPublished: true,
  };
};
