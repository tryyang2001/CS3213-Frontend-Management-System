export type Question = {
  id: string;
  title: string;
  description: string;
  deadline: number;
  examples: QuestionExample[];
  constraints: string[];
  referenceSolutionId: string?;
};
