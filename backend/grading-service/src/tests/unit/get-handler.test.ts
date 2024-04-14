import db from "../../models/db";
import StudentSolution from "../payloads/student-code";
import { GetHandler } from "../../services/get-handler";
import NotExistingStudentError from "../../libs/errors/NotExistingStudentError";

describe("Unit Tests for Get Handler", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Unit Tests for getSubmissionsByQuestionIdAndStudentId", () => {
    beforeEach(() => {
      dbMock.user.findUnique = jest.fn().mockImplementation(
        (query: {
          where: {
            uid: number;
          };
        }) => {
          if (query.where.uid === 1) {
            return Promise.resolve({ id: 1 });
          }

          return Promise.resolve(null);
        }
      );

      dbMock.submission.findMany = jest
        .fn()
        .mockImplementation(
          (query: { where: { questionId: string; studentId: number } }) => {
            if (
              query.where.questionId === "existing-question-id" &&
              query.where.studentId === 1
            ) {
              return Promise.resolve(StudentSolution.submissions);
            } else if (query.where.studentId === 1) {
              return Promise.resolve([]);
            }

            return Promise.resolve(null);
          }
        );
    });

    describe("Given an existing questionId and studentId with submissions", () => {
      it("should return the submissions", async () => {
        // Arrange
        const questionId = "existing-question-id";
        const studentId = 1;

        // Act
        const submissions =
          await GetHandler.getSubmissionsByQuestionIdAndStudentId(
            questionId,
            studentId
          );

        // Assert
        expect(dbMock.user.findUnique).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findMany).toHaveBeenCalledTimes(1);
        expect(submissions).toEqual([
          {
            ...StudentSolution.submissions[0],
            createdOn: StudentSolution.submissions[0].createdOn.getTime(),
          },
        ]);
      });
    });

    describe("Given a non-existing questionId", () => {
      it("should return an empty array", async () => {
        // Arrange
        const questionId = "non-existing-question-id";
        const studentId = 1;

        // Act
        const submissions =
          await GetHandler.getSubmissionsByQuestionIdAndStudentId(
            questionId,
            studentId
          );

        // Assert
        expect(dbMock.user.findUnique).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findMany).toHaveBeenCalledTimes(1);
        expect(submissions).toEqual([]);
      });
    });

    describe("Given a non-existing studentId", () => {
      it("should throw an error", async () => {
        // Arrange
        const questionId = "existing-question-id";
        const studentId = 2;

        // Act
        const submissions = GetHandler.getSubmissionsByQuestionIdAndStudentId(
          questionId,
          studentId
        );

        // Assert
        expect(dbMock.user.findUnique).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findMany).toHaveBeenCalledTimes(0);
        await expect(submissions).rejects.toThrow(
          new NotExistingStudentError(2)
        );
      });
    });

    describe("Given the database is down", () => {
      it("should throw an error", async () => {
        // Arrange
        dbMock.submission.findMany = jest
          .fn()
          .mockRejectedValue(new Error("Database is down"));

        const questionId = "existing-question-id";
        const studentId = 1;

        // Act
        const apiCall = GetHandler.getSubmissionsByQuestionIdAndStudentId(
          questionId,
          studentId
        );

        // Assert
        expect(dbMock.user.findUnique).toHaveBeenCalledTimes(1);
        await expect(apiCall).rejects.toThrow(new Error("Database is down"));
      });
    });
  });

  describe("Unit Tests for getLatestSubmissionByQuestionIdAndStudentId", () => {
    beforeEach(() => {
      dbMock.user.findUnique = jest.fn().mockImplementation(
        (query: {
          where: {
            uid: number;
          };
        }) => {
          if (query.where.uid === 1) {
            return Promise.resolve({ id: 1 });
          }

          return Promise.resolve(null);
        }
      );

      dbMock.submission.findFirst = jest
        .fn()
        .mockImplementation(
          (query: { where: { questionId: string; studentId: number } }) => {
            if (
              query.where.questionId === "existing-question-id" &&
              query.where.studentId === 1
            ) {
              return Promise.resolve(StudentSolution.submissions[0]);
            }

            return Promise.resolve(null);
          }
        );
    });

    describe("Given an existing questionId and studentId with submissions", () => {
      it("should return the latest submission", async () => {
        // Arrange
        const questionId = "existing-question-id";
        const studentId = 1;

        // Act
        const submission =
          await GetHandler.getLatestSubmissionByQuestionIdAndStudentId(
            questionId,
            studentId
          );

        // Assert
        expect(dbMock.user.findUnique).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findFirst).toHaveBeenCalledTimes(1);
        expect(submission).toEqual({
          ...StudentSolution.submissions[0],
          createdOn: StudentSolution.submissions[0].createdOn.getTime(),
        });
      });
    });

    describe("Given a non-existing questionId", () => {
      it("should return null", async () => {
        // Arrange
        const questionId = "non-existing-question-id";
        const studentId = 1;

        // Act
        const submission =
          await GetHandler.getLatestSubmissionByQuestionIdAndStudentId(
            questionId,
            studentId
          );

        // Assert
        expect(dbMock.user.findUnique).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findFirst).toHaveBeenCalledTimes(1);
        expect(submission).toBeNull();
      });
    });

    describe("Given a non-existing studentId", () => {
      it("should throw an error", async () => {
        // Arrange
        const questionId = "existing-question-id";
        const studentId = 2;

        // Act
        const submission =
          GetHandler.getLatestSubmissionByQuestionIdAndStudentId(
            questionId,
            studentId
          );

        // Assert
        expect(dbMock.user.findUnique).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findFirst).toHaveBeenCalledTimes(0);
        await expect(submission).rejects.toThrow(
          new NotExistingStudentError(2)
        );
      });
    });
  });

  describe("Unit Tests for getSubmittersByAssignmentId", () => {
    describe("Given an existing assignmentId with submitters", () => {
      it("should return the submitters without duplicates", async () => {
        // Arrange
        const assignmentId = "existing-assignment-id";
        const now = new Date();

        dbMock.assignment.findUnique = jest.fn().mockResolvedValue({
          id: "existing-assignment-id",
        });

        dbMock.submission.findMany = jest.fn().mockResolvedValue([
          {
            studentId: 1,
            student: {
              name: "John Doe",
            },
            createdOn: now,
          },
          {
            studentId: 2,
            student: {
              name: "Jane Doe",
            },
            createdOn: now,
          },
        ]);

        // Act
        const submitters =
          await GetHandler.getSubmittersByAssignmentId(assignmentId);

        // Assert
        expect(dbMock.assignment.findUnique).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findMany).toHaveBeenCalledTimes(1);
        expect(submitters).toEqual([
          {
            studentId: 1,
            name: "John Doe",
            createdOn: now.getTime(),
          },
          {
            studentId: 2,
            name: "Jane Doe",
            createdOn: now.getTime(),
          },
        ]);
      });
    });

    describe("Given an existing assignmentId without submitters", () => {
      it("should return an empty array", async () => {
        // Arrange
        const assignmentId = "existing-assignment-id";

        dbMock.assignment.findUnique = jest.fn().mockResolvedValue({
          id: "existing-assignment-id",
        });

        dbMock.submission.findMany = jest.fn().mockResolvedValue([]);

        // Act
        const submitters =
          await GetHandler.getSubmittersByAssignmentId(assignmentId);

        // Assert
        expect(dbMock.assignment.findUnique).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findMany).toHaveBeenCalledTimes(1);
        expect(submitters).toEqual([]);
      });
    });

    describe("Given a non-existing assignmentId", () => {
      it("should return null", async () => {
        // Arrange
        const assignmentId = "non-existing-assignment-id";

        dbMock.assignment.findUnique = jest.fn().mockResolvedValue(null);

        // Act
        const submitters =
          await GetHandler.getSubmittersByAssignmentId(assignmentId);

        // Assert
        expect(dbMock.assignment.findUnique).toHaveBeenCalledTimes(1);
        expect(submitters).toBeNull();
      });
    });
  });
});
