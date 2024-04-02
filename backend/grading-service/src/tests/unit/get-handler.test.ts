import db from "../../models/db";
import StudentSolution from "../payloads/student-code";
import { GetHandler } from "../../services/get-handler";

describe("Unit Tests for Get Handler", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Unit Tests for getSubmissionByQuestionIdAndStudentId", () => {
    beforeEach(() => {
      dbMock.submission.findFirst = jest
        .fn()
        .mockImplementation(
          (query: { where: { questionId: string; studentId: number } }) => {
            if (
              query.where.questionId === "existing-question-id" &&
              query.where.studentId === 1
            ) {
              return Promise.resolve(StudentSolution.submission);
            }

            return Promise.resolve(null);
          }
        );
    });

    describe("Given an existing questionId and studentId with an existing submission", () => {
      it("should return the submission", async () => {
        // Arrange
        const questionId = "existing-question-id";
        const studentId = 1;

        // Act
        const submission =
          await GetHandler.getSubmissionByQuestionIdAndStudentId(
            questionId,
            studentId
          );

        // Assert
        expect(dbMock.submission.findFirst).toHaveBeenCalledTimes(1);
        expect(submission).toEqual(StudentSolution.submission);
      });
    });

    describe("Given a non-existing questionId", () => {
      it("should return null", async () => {
        // Arrange
        const questionId = "non-existing-question-id";
        const studentId = 1;

        // Act
        const submission =
          await GetHandler.getSubmissionByQuestionIdAndStudentId(
            questionId,
            studentId
          );

        // Assert
        expect(dbMock.submission.findFirst).toHaveBeenCalledTimes(1);
        expect(submission).toBeNull();
      });
    });

    describe("Given a non-existing studentId", () => {
      it("should return null", async () => {
        // Arrange
        const questionId = "existing-question-id";
        const studentId = 2;

        // Act
        const submission =
          await GetHandler.getSubmissionByQuestionIdAndStudentId(
            questionId,
            studentId
          );

        // Assert
        expect(dbMock.submission.findFirst).toHaveBeenCalledTimes(1);
        expect(submission).toBeNull();
      });
    });

    describe("Given the database is down", () => {
      it("should throw an error", async () => {
        // Arrange
        dbMock.submission.findFirst = jest
          .fn()
          .mockRejectedValue(new Error("Database is down"));

        const questionId = "existing-question-id";
        const studentId = 1;

        // Act
        const apiCall = GetHandler.getSubmissionByQuestionIdAndStudentId(
          questionId,
          studentId
        );

        // Assert
        await expect(apiCall).rejects.toThrow(new Error("Database is down"));
      });
    });
  });
});
