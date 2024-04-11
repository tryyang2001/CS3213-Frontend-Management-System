export const getUpdatedQuestionDbResponse = () => {
  return {
    id: "existing-question-id",
    title: "Updated Question Title",
    description: "<p>Updated Question Description</p>",
    deadline: new Date("2024-12-31T23:59:59.999Z"),
    numberOfTestCases: 0,
    referenceSolution: null,
    assignmentId: "existing-assignment-id",
    createdOn: new Date("2024-12-30T00:00:00.000Z"),
  };
};

export const getUpdatedQuestionExpectedResponse = () => {
  return {
    id: "existing-question-id",
    title: "Updated Question Title",
    description: "<p>Updated Question Description</p>",
    deadline: new Date("2024-12-31T23:59:59.999Z").getTime(),
    numberOfTestCases: 0,
    assignmentId: "existing-assignment-id",
    createdOn: new Date("2024-12-30T00:00:00.000Z").getTime(),
  };
};
