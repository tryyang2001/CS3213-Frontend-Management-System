export const getCreateQuestionReferenceSolutionRequestBody = (): {
  language: "python" | "c";
  code: string;
} => {
  return {
    language: "python" as "python" | "c",
    code: "print('Hello, World!')",
  };
};
