import { ErrorFeedback } from "../../models/its/error-feedback";

const CodeError = {
  hintStrings: ["Incorrect else-block for if ( ((x % 2) == 1) )"],
  errorFeedbacks: [
    {
      line: 2,
      hints: ["Incorrect else-block for if ( ((x % 2) == 1) )"],
    },
  ] as ErrorFeedback[],
};

export default CodeError;
