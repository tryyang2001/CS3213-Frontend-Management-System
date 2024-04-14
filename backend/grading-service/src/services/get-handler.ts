import NotExistingStudentError from "../libs/errors/NotExistingStudentError";
import db from "../models/db";

const getSubmissionsByQuestionIdAndStudentId = async (
  questionId: string,
  studentId: number
) => {
  // check if the user exists
  const student = await db.user.findUnique({
    where: {
      uid: studentId,
    },
  });

  if (!student) {
    throw new NotExistingStudentError(studentId);
  }

  const submissions = await db.submission.findMany({
    where: {
      questionId: questionId,
      studentId: studentId,
    },
    select: {
      id: true,
      questionId: true,
      studentId: true,
      language: true,
      code: true,
      feedbacks: {
        select: {
          line: true,
          hints: true,
        },
      },
      createdOn: true,
    },
    orderBy: {
      createdOn: "desc",
    },
  });

  return submissions.map((submission) => {
    return {
      ...submission,
      createdOn: submission.createdOn.getTime(),
    };
  });
};

const getLatestSubmissionByQuestionIdAndStudentId = async (
  questionId: string,
  studentId: number
) => {
  // check if the user exists
  const student = await db.user.findUnique({
    where: {
      uid: studentId,
    },
  });

  if (!student) {
    throw new NotExistingStudentError(studentId);
  }

  const latestSubmission = await db.submission.findFirst({
    where: {
      questionId: questionId,
      studentId: studentId,
    },
    select: {
      id: true,
      questionId: true,
      studentId: true,
      language: true,
      code: true,
      feedbacks: {
        select: {
          line: true,
          hints: true,
        },
      },
      createdOn: true,
    },
    orderBy: {
      createdOn: "desc",
    },
  });

  if (!latestSubmission) {
    return null;
  }

  return latestSubmission;
};

interface Submitter {
  studentId: number;
  name: string;
  createdOn: number;
}

const getSubmittersByAssignmentId = async (
  assignmentId: string
): Promise<Submitter[] | null> => {
  // check if the assignment exists
  const assignment = await db.assignment.findUnique({
    where: {
      id: assignmentId,
    },
  });

  if (!assignment) {
    return null;
  }

  // find all unique submitters (student id) with the latest submission createdOn
  const submitters = await db.submission.findMany({
    where: {
      question: {
        assignmentId: assignmentId,
      },
    },
    select: {
      studentId: true,
      student: {
        select: {
          name: true,
        },
      },
      createdOn: true,
    },
    orderBy: {
      createdOn: "desc",
    },
    distinct: ["studentId"],
  });

  return submitters.map((submitter) => {
    return {
      studentId: submitter.studentId,
      name: submitter.student.name,
      createdOn: submitter.createdOn.getTime(),
    } as Submitter;
  });
};

export const GetHandler = {
  getSubmissionsByQuestionIdAndStudentId,
  getLatestSubmissionByQuestionIdAndStudentId,
  getSubmittersByAssignmentId,
};
