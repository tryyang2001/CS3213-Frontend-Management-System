export type Assignment = {
  id: string;
  title: string;
  deadline: number;
  description?: string;
  isPublished: boolean;
  numberOfQuestions: number;
  questions?: Question[];
  authors: number[];
  createdOn: number;
  updatedOn: number;
};
