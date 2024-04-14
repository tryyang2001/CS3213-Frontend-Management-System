import supertest from "supertest";
import db from "../../../models/db";
import { DeleteHandler } from "../../../services/questions/delete-handler";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for deleteQuestion", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given an existing questionId", () => {
    it("should delete the question with the given questionId", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.question.delete = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.assignment.update = jest.fn().mockResolvedValue({
        id: "assignment-id",
        numberOfQuestions: 1,
      });

      // Act
      const question = await DeleteHandler.deleteQuestion(questionId);

      // Assert
      expect(question).not.toBeNull();
      expect(question?.id).toBe(questionId);
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      dbMock.question.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const question = await DeleteHandler.deleteQuestion(questionId);

      // Assert
      expect(question).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.question.delete = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act and Assert
      await expect(DeleteHandler.deleteQuestion(questionId)).rejects.toThrow(
        "Database is down"
      );
    });
  });
});

describe("Unit Tests for DELETE /assignment/api/questions/:id", () => {
  const app = createUnitTestServer();

  describe("Given an existing questionId", () => {
    it("should return 204 and delete the question with the given questionId", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(DeleteHandler, "deleteQuestion")
        .mockResolvedValue(Response.getQuestionByIdExpectedResponse());

      // Act
      const response = await supertest(app)
        .delete(`${API_PREFIX}/questions/${questionId}`)
        .send();

      // Assert
      expect(response.status).toBe(HttpStatusCode.NO_CONTENT);
      expect(response.body).toEqual({});

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return 404 and an error message", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const spy = jest
        .spyOn(DeleteHandler, "deleteQuestion")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .delete(`${API_PREFIX}/questions/${questionId}`)
        .send();

      // Assert
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Question not found",
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
        .spyOn(DeleteHandler, "deleteQuestion")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app)
        .delete(`${API_PREFIX}/questions/${questionId}`)
        .send();

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
