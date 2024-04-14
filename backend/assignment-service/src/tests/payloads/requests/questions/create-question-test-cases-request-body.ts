export const getCreateQuestionTestCasesRequestBody = (): {
  testCases: {
    input: string;
    output: string;
    isPublic: boolean;
  }[];
} => {
  return {
    testCases: [
      {
        input: "input-1",
        output: "output-1",
        isPublic: true,
      },
      {
        input: "input-2",
        output: "output-2",
        isPublic: false,
      },
    ],
  };
};
