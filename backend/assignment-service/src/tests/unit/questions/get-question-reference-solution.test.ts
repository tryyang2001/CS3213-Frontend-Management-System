import supertest from "supertest";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";
import db from "../../../models/db";
import { GetHandler } from "../../../services/questions/get-handler";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for getQuestionReferenceSolution", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given an existing questionId with reference solution", () => {
    it("should return the reference solution with the given questionId", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.referenceSolution.findFirst = jest
        .fn()
        .mockResolvedValue(
          Response.getQuestionReferenceSolutionDbResponse(questionId)
        );

      // Act
      const referenceSolution =
        await GetHandler.getQuestionReferenceSolution(questionId);

      // Assert
      expect(referenceSolution).toEqual(
        Response.getQuestionReferenceSolutionExpectedResponse(questionId)
      );
    });
  });

  describe("Given an existing questionId without reference solution", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue(null);

      // Act
      const referenceSolution =
        await GetHandler.getQuestionReferenceSolution(questionId);

      // Assert
      expect(referenceSolution).toBeNull();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue(null);

      // Act
      const referenceSolution =
        await GetHandler.getQuestionReferenceSolution(questionId);

      // Assert
      expect(referenceSolution).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.referenceSolution.findFirst = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act & Assert
      await expect(
        GetHandler.getQuestionReferenceSolution(questionId)
      ).rejects.toThrow("Database is down");
    });
  });
});

describe("Unit Tests for GET /assignment/api/questions/:id/reference-solution", () => {
  const app = createUnitTestServer();

  describe("Given an existing questionId with reference solution", () => {
    it("should return the reference solution with the given questionId", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(GetHandler, "getQuestionReferenceSolution")
        .mockResolvedValue(
          Response.getQuestionReferenceSolutionExpectedResponse()
        );

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/questions/${questionId}/solution`
      );

      // Assert
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual(
        Response.getQuestionReferenceSolutionExpectedResponse()
      );

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given an existing questionId without reference solution", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(GetHandler, "getQuestionReferenceSolution")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/questions/${questionId}/solution`
      );

      // Assert
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Solution or question not found",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const spy = jest
        .spyOn(GetHandler, "getQuestionReferenceSolution")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/questions/${questionId}/solution`
      );

      // Assert
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Solution or question not found",
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
        .spyOn(GetHandler, "getQuestionReferenceSolution")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app).get(
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
