export const getAssignmentByIdDbResponse = (
  assignmentId?: string,
  userId?: string
) => {
  const deadline = new Date("2024-12-31T00:00:00.000Z");
  const createdOn = new Date("2024-03-12T00:00:00.000Z");

  return {
    id: assignmentId ?? "existing-assignment-id",
    title: "Assignment 1",
    deadline: deadline,
    authors: [userId ?? "existing-user-id"],
    description: null,
    isPublished: true,
    numberOfQuestions: 2,
    createdOn: createdOn,
    updatedOn: createdOn,
    questions: [
      {
        id: "question-id-1",
        title: "Question 1",
        description: "Description 1",
        deadline: deadline,
        numberOfTestCases: 1,
        referenceSolutionId: "solution-id-1",
      },
      {
        id: "question-id-2",
        title: "Question 2",
        description: "Description 2",
        deadline: deadline,
        numberOfTestCases: 2,
        referenceSolutionId: "solution-id-2",
      },
    ],
  };
};

export const getAssignmentByIdExpectedResponse = (
  assignmentId?: string,
  userId?: string
) => {
  const deadline = new Date("2024-12-31T00:00:00.000Z").getTime();
  const createdOn = new Date("2024-03-12T00:00:00.000Z").getTime();

  return {
    id: assignmentId ?? "existing-assignment-id",
    title: "Assignment 1",
    deadline: deadline,
    authors: [userId ?? "existing-user-id"],
    isPublished: true,
    numberOfQuestions: 2,
    createdOn: createdOn,
    updatedOn: createdOn,
    questions: [
      {
        id: "question-id-1",
        title: "Question 1",
        description: "Description 1",
        deadline: deadline,
        numberOfTestCases: 1,
        referenceSolutionId: "solution-id-1",
      },
      {
        id: "question-id-2",
        title: "Question 2",
        description: "Description 2",
        deadline: deadline,
        numberOfTestCases: 2,
        referenceSolutionId: "solution-id-2",
      },
    ],
  };
};
