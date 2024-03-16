class ITSPostParserError extends Error {
  constructor() {
    super("Failed to generate parser string from ITS API");
  }
}

export default ITSPostParserError;
