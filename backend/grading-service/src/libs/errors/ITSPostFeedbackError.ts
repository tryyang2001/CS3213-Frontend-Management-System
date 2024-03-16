class ITSPostFeedbackError extends Error {
  constructor() {
    super("Failed to generate feedback from ITS API");
  }
}

export default ITSPostFeedbackError;
