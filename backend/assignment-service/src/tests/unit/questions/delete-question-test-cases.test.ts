import supertest from "supertest";
import db from "../../../models/db";
import { DeleteHandler } from "../../../services/questions/delete-handler";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for deleteQuestionTestCases", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given existing questionId and testCaseIds", () => {
    it("should delete the test cases with the given questionId and testCaseIds", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const testCaseIds = [
        "existing-test-case-id-1",
        "existing-test-case-id-2",
      ];
      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.testCase.deleteMany = jest.fn().mockResolvedValue({
        count: 2,
      });
      dbMock.question.update = jest.fn().mockResolvedValue({
        id: questionId,
        numberOfTestCases: 0,
      });

      // Act
      const deleteResult = await DeleteHandler.deleteQuestionTestCases(
        questionId,
        testCaseIds
      );

      // Assert
      expect(deleteResult).not.toBeNull();
      expect(deleteResult?.count).toBe(2);
    });
  });

  describe("Given test case ids contain some non-existing test cases", () => {
    it("should still delete existing test cases", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const testCaseIds = [
        "non-existing-test-case-id-1",
        "non-existing-test-case-id-2",
        "existing-test-case-id-1",
      ];
      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.testCase.deleteMany = jest.fn().mockResolvedValue({
        count: 1,
      });
      dbMock.question.update = jest.fn().mockResolvedValue({
        id: questionId,
        numberOfTestCases: 0,
      });

      // Act
      const deleteResult = await DeleteHandler.deleteQuestionTestCases(
        questionId,
        testCaseIds
      );

      // Assert
      expect(deleteResult).not.toBeNull();
      expect(deleteResult?.count).toBe(1);
    });
  });

  describe("Given an existing questionId with no test cases", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const testCaseIds = [
        "existing-test-case-id-1",
        "existing-test-case-id-2",
      ];
      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.testCase.deleteMany = jest.fn().mockResolvedValue({
        count: 0,
      });

      // Act
      const deleteResult = await DeleteHandler.deleteQuestionTestCases(
        questionId,
        testCaseIds
      );

      // Assert
      expect(deleteResult).toBeNull();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const testCaseIds = [
        "existing-test-case-id-1",
        "existing-test-case-id-2",
      ];
      dbMock.question.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const deleteResult = await DeleteHandler.deleteQuestionTestCases(
        questionId,
        testCaseIds
      );

      // Assert
      expect(deleteResult).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const testCaseIds = [
        "existing-test-case-id-1",
        "existing-test-case-id-2",
      ];
      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.testCase.deleteMany = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act & Assert
      await expect(
        DeleteHandler.deleteQuestionTestCases(questionId, testCaseIds)
      ).rejects.toThrow("Database is down");
    });
  });
});

describe("Unit Tests for DELETE /assignment/api/questions/:id/test-cases", () => {
  const app = createUnitTestServer();

  describe("Given an existing questionId and testCaseIds", () => {
    it("should delete the test cases with the given questionId and testCaseIds", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const testCaseIds = [
        "existing-test-case-id-1",
        "existing-test-case-id-2",
      ];
      const spy = jest
        .spyOn(DeleteHandler, "deleteQuestionTestCases")
        .mockResolvedValue({
          count: 2,
        });

      // Act
      const response = await supertest(app)
        .delete(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send({
          testCaseIds: testCaseIds,
        });

      // Assert
      expect(response.status).toBe(HttpStatusCode.NO_CONTENT);
      expect(response.body).toEqual({});

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the request body contains some test case ids not exist in the question", () => {
    it("should return 204 and still delete the existing test cases", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const testCaseIds = [
        "non-existing-test-case-id-1",
        "non-existing-test-case-id-2",
        "existing-test-case-id-1",
      ];
      const spy = jest
        .spyOn(DeleteHandler, "deleteQuestionTestCases")
        .mockResolvedValue({
          count: 1,
        });

      // Act
      const response = await supertest(app)
        .delete(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send({
          testCaseIds: testCaseIds,
        });

      // Assert
      expect(response.status).toBe(HttpStatusCode.NO_CONTENT);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given an existing questionId with no test cases", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const testCaseIds = [
        "existing-test-case-id-1",
        "existing-test-case-id-2",
      ];
      const spy = jest
        .spyOn(DeleteHandler, "deleteQuestionTestCases")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .delete(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send({
          testCaseIds: testCaseIds,
        });

      // Assert
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Test cases or question not found",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const testCaseIds = [
        "existing-test-case-id-1",
        "existing-test-case-id-2",
      ];
      const spy = jest
        .spyOn(DeleteHandler, "deleteQuestionTestCases")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .delete(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send({
          testCaseIds: testCaseIds,
        });

      // Assert
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Test cases or question not found",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given an empty request body", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest.spyOn(DeleteHandler, "deleteQuestionTestCases");

      // Act
      const response = await supertest(app)
        .delete(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send();

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Request body is empty",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the request body contains extra fields", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const testCaseIds = [
        "existing-test-case-id-1",
        "existing-test-case-id-2",
      ];
      const spy = jest.spyOn(DeleteHandler, "deleteQuestionTestCases");

      // Act
      const response = await supertest(app)
        .delete(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send({
          testCaseIds: testCaseIds,
          extraField: "extra",
        });

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Request body must contain only the required fields",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the database is down", () => {
    it("should return 500 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const testCaseIds = [
        "existing-test-case-id-1",
        "existing-test-case-id-2",
      ];
      const spy = jest
        .spyOn(DeleteHandler, "deleteQuestionTestCases")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app)
        .delete(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send({
          testCaseIds: testCaseIds,
        });

      // Assert
      expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has ocurred. Please try again later",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });
});
