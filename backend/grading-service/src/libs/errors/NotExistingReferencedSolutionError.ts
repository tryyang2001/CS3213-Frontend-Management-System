// define NotExistingReferencedSolutionError
class NotExistingReferencedSolutionError extends Error {
  constructor() {
    super("Referenced solution does not exist");
  }
}

export default NotExistingReferencedSolutionError;
