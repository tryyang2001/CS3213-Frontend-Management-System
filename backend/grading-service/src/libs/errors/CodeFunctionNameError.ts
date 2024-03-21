class CodeFunctionNameError extends Error {
  constructor(targetFunction: string) {
    super(
      `Solution code does not contain the target function "${targetFunction}" declaration`
    );
  }
}

export default CodeFunctionNameError;
