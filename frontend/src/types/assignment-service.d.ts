interface CreateAssignmentBody {
  title: string;
  deadline: Date;
  isPublished?: boolean;
}

interface CreateQuestionBody {
  title: string;
  description: string;
  deadline?: Date;
  testCases: TestCase[];
  referenceSolution: ReferenceSolution;
}

interface Assignment {
  id: string;
  title: string;
  deadline: number;
  isPublished: boolean;
  numberOfQuestions: number;
  questions?: Question[];
  authors: string[];
  createdOn: number;
  updatedOn: number;
}

interface Question {
  id: string;
  title: string;
  description: string;
  deadline: number;
  numberOfTestCases: number;
  assignmentId?: string;
  referenceSolutionId?: string;
}

interface TestCase {
  id?: string;
  input: string;
  output: string;
  isPublic: boolean;
}

interface ReferenceSolution {
  id?: string;
  language: string;
  code: string;
  questionId?: string;
}
