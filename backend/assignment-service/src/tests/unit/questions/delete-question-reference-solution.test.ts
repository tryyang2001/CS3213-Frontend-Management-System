import supertest from "supertest";
import db from "../../../models/db";
import { DeleteHandler } from "../../../services/questions/delete-handler";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for deleteQuestionReferenceSolution", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given an existing questionId with reference solution", () => {
    it("should delete the reference solution with the given questionId", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue({
        questionId: questionId,
      });
      dbMock.referenceSolution.delete = jest.fn().mockResolvedValue({
        questionId: questionId,
      });
      dbMock.question.update = jest.fn().mockResolvedValue({
        questionId: questionId,
      });

      // Act
      const referenceSolution =
        await DeleteHandler.deleteQuestionReferenceSolution(questionId);

      // Assert
      expect(referenceSolution).not.toBeNull();
      expect(referenceSolution?.questionId).toBe(questionId);
    });
  });

  describe("Given an existing questionId with no reference solution", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue(null);

      // Act
      const referenceSolution =
        await DeleteHandler.deleteQuestionReferenceSolution(questionId);

      // Assert
      expect(referenceSolution).toBeNull();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      dbMock.question.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const referenceSolution =
        await DeleteHandler.deleteQuestionReferenceSolution(questionId);

      // Assert
      expect(referenceSolution).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.referenceSolution.findFirst = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act and Assert
      await expect(
        DeleteHandler.deleteQuestionReferenceSolution(questionId)
      ).rejects.toThrow("Database is down");
    });
  });
});

describe("Unit Tests for DELETE /assignment/api/questions/:id/solution", () => {
  const app = createUnitTestServer();

  describe("Given an existing questionId with reference solution", () => {
    it("should return 204 and delete the reference solution with the given questionId", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(DeleteHandler, "deleteQuestionReferenceSolution")
        .mockResolvedValue({
          id: "solution-id-1",
          questionId: questionId,
          language: "python",
          code: "print('Hello, World!')",
          codeParser: "some code parser value",
        });

      // Act
      const response = await supertest(app).delete(
        `${API_PREFIX}/questions/${questionId}/solution`
      );

      // Assert
      expect(response.status).toBe(HttpStatusCode.NO_CONTENT);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return 404 and an error message", async () => {
      // Arrange
      const questionId = "non-existing-question-id";

      // Act
      const response = await supertest(app).delete(
        `${API_PREFIX}/questions/${questionId}/solution`
      );

      // Assert
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Reference solution or question not found",
      });
    });
  });

  describe("Given an existing questionId with no reference solution", () => {
    it("should return 404 and an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(DeleteHandler, "deleteQuestionReferenceSolution")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app).delete(
        `${API_PREFIX}/questions/${questionId}/solution`
      );

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Reference solution or question not found",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the database is down", () => {
    it("should return 500 and an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(DeleteHandler, "deleteQuestionReferenceSolution")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app).delete(
        `${API_PREFIX}/questions/${questionId}/solution`
      );

      // Assert
      expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has occurred. Please try again later",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });
});
