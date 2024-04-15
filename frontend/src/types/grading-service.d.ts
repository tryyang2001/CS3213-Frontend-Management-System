interface PostFeedbackBody {
  language: string;
  source_code: string;
  question_id: string;
  student_id: number;
}

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

interface SubmissionInfo {
  questionId: string;
  createdOn: number;
}

interface Submitter {
  studentId: number;
  name: string;
  createdOn: number;
}