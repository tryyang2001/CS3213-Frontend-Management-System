export const getCreateQuestionRequestBody = ({
  includeReferenceSolution,
  includeTestCases,
}: {
  includeReferenceSolution?: boolean;
  includeTestCases?: boolean;
} = {}) => {
  includeReferenceSolution = includeReferenceSolution ?? true;
  includeTestCases = includeTestCases ?? true;

  return {
    title: "Question Title",
    description: "<p>Question Description in HTML format</p>",
    deadline: new Date("2024-12-31T23:59:59.999Z").getTime(),
    testCases: includeTestCases
      ? [
          {
            input: "Input 1",
            output: "Output 1",
            isPublic: true,
          },
          {
            input: "Input 2",
            output: "Output 2",
            isPublic: false,
          },
        ]
      : undefined,
    referenceSolution: includeReferenceSolution
      ? {
          language: "Python",
          code: "print('Hello, World!')",
        }
      : undefined,
  };
};
