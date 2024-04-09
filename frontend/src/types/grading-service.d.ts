interface Feedback {
  id: string;
  submissionId: string;
  line: number;
  hints: string[];
}

interface Submission {
  id: string;
  questionId: string;
  studentId: number;
  code: string;
  language: string;
  feedbacks: {
    line: number;
    hints: string[];
  }[];
  createdOn: number;
}
