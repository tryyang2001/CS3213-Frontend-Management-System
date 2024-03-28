export const getCreatedTestCasesDbResponse = () => {
  return [
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
  ];
};

export const getCreatedTestCasesExpectedResponse = () => {
  return {
    count: 2,
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
