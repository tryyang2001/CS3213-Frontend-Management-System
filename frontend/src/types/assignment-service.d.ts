type Assignment = {
  id: string;
  title: string;
  deadline: number;
  isPublished: boolean;
  numberOfQuestions: number;
  questions: Question[];
  authors: string[];
  createdOn: number;
  updatedOn: number;
};

type Question = {
  id: string;
  title: string;
  description: string;
  deadline?: number;
  numberOfTestCases: number;
  testCases?: TestCase[];
  referenceSolutionId?: string;
  referenceSolution?: ReferenceSolution;
  assignmentId?: string;
};

type TestCase = {
  id?: string;
  input: string;
  output: string;
  isPublic: boolean = true;
};

type ReferenceSolution = {
  id?: string;
  language: string;
  code: string;
  questionId?: string;
};
