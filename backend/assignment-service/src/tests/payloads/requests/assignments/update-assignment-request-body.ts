export const getUpdateAssignmentRequestBody = (): {
  title: string;
  deadline: number;
  authors: number[];
  isPublished: boolean;
} => {
  return {
    title: "Updated Assignment 1",
    deadline: new Date("2024-12-31T23:59:59.998Z").getTime(),
    authors: [1, 2],
    isPublished: true,
  };
};
