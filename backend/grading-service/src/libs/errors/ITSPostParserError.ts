class ITSPostParserError extends Error {
  errorField: string;

  constructor(errorField: string) {
    super("Failed to generate parser string from ITS API");
    this.errorField = errorField;
  }
}

export default ITSPostParserError;
