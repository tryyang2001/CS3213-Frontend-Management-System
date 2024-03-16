export const GetAssignmentsResponse = (userId: string) => {
  const deadline = new Date("2024-12-31T00:00:00.000Z").getTime();
  const createdOn = new Date("2024-03-12T00:00:00.000Z").getTime();

  return {
    assignments: [
      {
        id: "assignment-1",
        title: "Assignment 1",
        deadline: deadline,
        authors: [userId],
        isPublished: true,
        numberOfQuestions: 1,
        createdOn: createdOn,
        updatedOn: createdOn,
      },
      {
        id: "assignment-2",
        title: "Assignment 2",
        deadline: deadline,
        authors: [userId],
        isPublished: false,
        numberOfQuestions: 3,
        createdOn: createdOn,
        updatedOn: createdOn,
      },
    ],
  };
};

export const GetAssignmentsByUserIdDbResponse = (userId: string) => {
  const deadline = new Date("2024-12-31T00:00:00.000Z");
  const createdOn = new Date("2024-03-12T00:00:00.000Z");

  return [
    {
      id: "assignment-1",
      title: "Assignment 1",
      deadline: deadline,
      authors: [userId],
      isPublished: true,
      numberOfQuestions: 1,
      createdOn: createdOn,
      updatedOn: createdOn,
    },
    {
      id: "assignment-2",
      title: "Assignment 2",
      deadline: deadline,
      authors: [userId],
      isPublished: false,
      numberOfQuestions: 3,
      createdOn: createdOn,
      updatedOn: createdOn,
    },
  ];
};

export const ExpectedAssignmentsFromGetAssignmentsByUserId = (
  userId: string
) => {
  const deadline = new Date("2024-12-31T00:00:00.000Z").getTime();
  const createdOn = new Date("2024-03-12T00:00:00.000Z").getTime();

  return [
    {
      id: "assignment-1",
      title: "Assignment 1",
      deadline: deadline,
      authors: [userId],
      isPublished: true,
      numberOfQuestions: 1,
      createdOn: createdOn,
      updatedOn: createdOn,
    },
    {
      id: "assignment-2",
      title: "Assignment 2",
      deadline: deadline,
      authors: [userId],
      isPublished: false,
      numberOfQuestions: 3,
      createdOn: createdOn,
      updatedOn: createdOn,
    },
  ];
};
