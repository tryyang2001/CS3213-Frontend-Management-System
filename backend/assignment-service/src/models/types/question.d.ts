import { TestCase } from "./test-case";
import { ReferenceSolution } from "./reference-solution";

export type Question = {
  id: string;
  title: string;
  description: string;
  deadline?: number;
  numberOfTestCases: number;
  testCases?: TestCase[];
  referenceSolutionId?: string;
  referenceSolution?: ReferenceSolution;
  assignmentId?: string;
  createdOn: number;
};
