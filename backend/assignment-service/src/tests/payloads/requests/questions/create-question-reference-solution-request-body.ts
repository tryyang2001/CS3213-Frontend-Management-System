export const getCreateQuestionReferenceSolutionRequestBody = () => {
  return {
    language: "python" as "python" | "c",
    code: "print('Hello, World!')",
  };
};
