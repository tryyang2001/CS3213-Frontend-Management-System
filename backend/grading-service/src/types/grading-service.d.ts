export interface Submission {
  id: string;
  questionId: string;
  studentId: number;
  language: string;
  code: string;
  feedbacks: Feedback[];
  createdOn: number;
}

export interface Feedback {
  line: number;
  hints: string[];
}
