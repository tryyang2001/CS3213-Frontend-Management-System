export const getCreatedQuestionDbResponse = (
  includeReferenceSolution: boolean = true
) => {
  return {
    id: "new-question-id",
    title: "Question Title",
    description: "<p>Question Description in HTML format</p>",
    deadline: new Date("2024-12-31T23:59:59.999Z"),
    numberOfTestCases: 2,
    referenceSolution: includeReferenceSolution
      ? {
          id: "new-reference-solution-id",
          code: "print('Hello, World!')",
          language: "python",
        }
      : undefined,
    assignmentId: "existing-assignment-id",
  };
};

export const getCreatedQuestionExpectedResponse = (
  includeReferenceSolution: boolean = true
) => {
  return {
    id: "new-question-id",
    title: "Question Title",
    description: "<p>Question Description in HTML format</p>",
    deadline: new Date("2024-12-31T23:59:59.999Z").getTime(),
    numberOfTestCases: 2,
    referenceSolutionId: includeReferenceSolution
      ? "new-reference-solution-id"
      : undefined,
    assignmentId: "existing-assignment-id",
  };
};
