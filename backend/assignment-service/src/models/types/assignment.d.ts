export type Assignment = {
  id: string;
  title: string;
  deadline: number;
  isPublished: boolean;
  numberOfQuestions: number;
  questions?: Question[];
  authors: string[];
  createdOn: number;
  updatedOn: number;
};
