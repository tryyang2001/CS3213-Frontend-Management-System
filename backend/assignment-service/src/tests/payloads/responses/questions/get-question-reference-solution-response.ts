export const getQuestionReferenceSolutionDbResponse = (questionId?: string) => {
  return {
    id: "existing-solution-id-1",
    language: "python",
    code: "print('Hello, World!')",
    codeParser: "code parser value",
    questionId: questionId ?? "existing-question-id",
  };
};

export const getQuestionReferenceSolutionExpectedResponse = (
  questionId?: string
) => {
  return {
    id: "existing-solution-id-1",
    language: "python",
    code: "print('Hello, World!')",
    questionId: questionId ?? "existing-question-id",
  };
};
