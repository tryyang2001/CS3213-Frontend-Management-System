/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type */

export const getCreatedReferenceSolutionDbResponse = () => {
  return {
    id: "new-reference-solution-id",
    questionId: "existing-question-id",
    language: "python",
    code: "print('Hello, World!')",
  };
};

export const getCreatedReferenceSolutionExpectedResponse = () => {
  return {
    id: "new-reference-solution-id",
    questionId: "existing-question-id",
    language: "python",
    code: "print('Hello, World!')",
  };
};
