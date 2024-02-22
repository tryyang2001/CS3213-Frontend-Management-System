export type Assignment = {
  id: string;
  title: string;
  deadline: number;
  questions: Question[];
  authors: string[];
  createdOn: number;
  updatedOn: number;
};
