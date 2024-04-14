import { Feedback } from "../../types/grading-service";

const CodeError = {
  hintStrings: ["Incorrect else-block for if ( ((x % 2) == 1) )"],
  errorFeedbacks: [
    {
      line: 2,
      hints: ["Incorrect else-block for if ( ((x % 2) == 1) )"],
    },
  ] as Feedback[],
};

export default CodeError;
