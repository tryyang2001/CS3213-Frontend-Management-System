class DuplicateReferenceSolutionError extends Error {
  constructor(questionId: string) {
    super(`Reference solution for question ${questionId} already exists`);
  }
}

export default DuplicateReferenceSolutionError;
