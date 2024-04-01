export const getQuestionByIdDbResponse = (questionId?: string) => {
  return {
    id: questionId ?? "existing-question-id",
    title: "Question Title",
    description: "<p>Question Description in HTML format</p>",
    deadline: new Date("2024-12-31T23:59:59.999Z"),
    numberOfTestCases: 2,
    testCases: [
      {
        input: "input-1",
        output: "expected-output-1",
        isPublic: true,
      },
      {
        input: "input-2",
        output: "expected-output-2",
        isPublic: false,
      },
    ],
    assignmentId: "existing-assignment-id",
    referenceSolutionId: "existing-solution-id-1",
  };
};

export const getQuestionByIdExpectedResponse = (questionId?: string) => {
  return {
    id: questionId ?? "existing-question-id",
    title: "Question Title",
    description: "<p>Question Description in HTML format</p>",
    deadline: new Date("2024-12-31T23:59:59.999Z").getTime(),
    numberOfTestCases: 2,
    testCases: [
      {
        input: "input-1",
        output: "expected-output-1",
        isPublic: true,
      },
      {
        input: "input-2",
        output: "expected-output-2",
        isPublic: false,
      },
    ],
    assignmentId: "existing-assignment-id",
    referenceSolutionId: "existing-solution-id-1",
  };
};
