/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type */

export const getCreatedAssignmentExpectedResponse = (
  assignmentId?: string,
  userId?: number
) => {
  return {
    id: assignmentId ?? "existing-assignment-id",
    title: "Assignment 1",
    deadline: new Date("2024-12-31T23:59:59.999Z").getTime(),
    authors: [userId ?? 1],
    isPublished: true,
    numberOfQuestions: 0,
    createdOn: new Date("2024-03-12T00:00:00.000Z").getTime(),
    updatedOn: new Date("2024-03-12T00:00:00.000Z").getTime(),
  };
};

export const getCreatedAssignmentDbResponse = (
  assignmentId?: string,
  userId?: string
) => {
  return {
    id: assignmentId ?? "existing-assignment-id",
    title: "Assignment 1",
    deadline: new Date("2024-12-31T23:59:59.999Z"),
    authors: [userId ?? 1],
    isPublished: true,
    numberOfQuestions: 0,
    createdOn: new Date("2024-03-12T00:00:00.000Z"),
    updatedOn: new Date("2024-03-12T00:00:00.000Z"),
  };
};
