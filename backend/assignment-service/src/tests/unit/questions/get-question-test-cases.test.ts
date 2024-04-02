import supertest from "supertest";
import db from "../../../models/db";
import { GetHandler } from "../../../services/questions/get-handler";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for getQuestionTestCases", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given an existing questionId with 2 test cases", () => {
    it("should return the test cases of the question with the given questionId", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.testCase.findMany = jest
        .fn()
        .mockResolvedValue(Response.getQuestionTestCasesDbResponse());

      // Act
      const testCases = await GetHandler.getQuestionTestCases(questionId);

      // Assert
      expect(testCases).toEqual(
        Response.getQuestionTestCasesExpectedResponse()
      );
    });
  });

  describe("Given an existing questionId with 0 test cases", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.testCase.findMany = jest.fn().mockResolvedValue([]);

      // Act
      const testCases = await GetHandler.getQuestionTestCases(questionId);

      // Assert
      expect(testCases).toBeNull();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      dbMock.testCase.findMany = jest.fn().mockResolvedValue(null);

      // Act
      const testCases = await GetHandler.getQuestionTestCases(questionId);

      // Assert
      expect(testCases).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.testCase.findMany = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act & Assert
      await expect(GetHandler.getQuestionTestCases(questionId)).rejects.toThrow(
        "Database is down"
      );
    });
  });
});

describe("Unit Tests for GET /assignment/api/questions/:id/test-cases", () => {
  const app = createUnitTestServer();

  describe("Given an existing questionId with 2 test cases", () => {
    it("should return the test cases of the question with the given questionId", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(GetHandler, "getQuestionTestCases")
        .mockResolvedValue(Response.getQuestionTestCasesExpectedResponse());

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/questions/${questionId}/test-cases`
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        Response.getQuestionTestCasesExpectedResponse()
      );

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given an existing questionId with 0 test cases", () => {
    it("should return 200 with an empty array", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(GetHandler, "getQuestionTestCases")
        .mockResolvedValue([]);

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/questions/${questionId}/test-cases`
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return 404", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const spy = jest
        .spyOn(GetHandler, "getQuestionTestCases")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/questions/${questionId}/test-cases`
      );

      // Assert
      expect(response.status).toBe(404);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the database is down", () => {
    it("should return 500", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(GetHandler, "getQuestionTestCases")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/questions/${questionId}/test-cases`
      );

      // Assert
      expect(response.status).toBe(500);

      // reset the mocks
      spy.mockRestore();
    });
  });
});
