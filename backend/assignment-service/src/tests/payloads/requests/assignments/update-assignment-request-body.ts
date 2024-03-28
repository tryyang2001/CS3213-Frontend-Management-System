export const getUpdateAssignmentRequestBody = () => {
  return {
    title: "Updated Assignment 1",
    deadline: new Date("2024-12-31T23:59:59.998Z").getTime(),
    authors: ["existing-user-id", "new-user-id"],
    isPublished: true,
  };
};
