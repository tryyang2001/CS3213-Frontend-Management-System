export const getUpdatedReferenceSolutionDbResponse = () => {
  return {
    id: "existing-reference-solution-id",
    language: "c",
    code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}',
    codeParser: "not relevant",
    questionId: "existing-question-id",
  };
};

export const getUpdatedReferenceSolutionExpectedResponse = () => {
  return {
    id: "existing-reference-solution-id",
    language: "c",
    code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}',
    questionId: "existing-question-id",
  };
};
