class NotExistingTestCaseError extends Error {
  constructor() {
    super("Test case does not exist");
  }
}

export default NotExistingTestCaseError;
