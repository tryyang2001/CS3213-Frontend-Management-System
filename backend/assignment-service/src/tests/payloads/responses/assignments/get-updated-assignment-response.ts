export const getUpdatedAssignmentDbResponse = () => {
  return {
    id: "existing-assignment-id",
    title: "Updated Assignment 1",
    deadline: new Date("2024-12-31T23:59:59.998Z"),
    authors: ["existing-user-id", "new-user-id"],
    isPublished: true,
    numberOfQuestions: 0,
    createdOn: new Date("2024-03-12T00:00:00.000Z"),
    updatedOn: new Date("2024-03-15T00:00:00.000Z"),
  };
};

export const getUpdatedAssignmentResponse = () => {
  return {
    id: "existing-assignment-id",
    title: "Updated Assignment 1",
    deadline: new Date("2024-12-31T23:59:59.998Z").getTime(),
    authors: ["existing-user-id", "new-user-id"],
    isPublished: true,
    numberOfQuestions: 0,
    createdOn: new Date("2024-03-12T00:00:00.000Z").getTime(),
    updatedOn: new Date("2024-03-15T00:00:00.000Z").getTime(),
  };
};
