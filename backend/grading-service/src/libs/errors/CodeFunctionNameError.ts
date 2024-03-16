class CodeFunctionNameError extends Error {
  constructor() {
    super("Solution code does not contain the target function declaration");
  }
}

export default CodeFunctionNameError;
