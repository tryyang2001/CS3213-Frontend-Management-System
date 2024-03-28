import supertest from "supertest";
import db from "../../../models/db";
import { GetHandler } from "../../../services/questions/get-handler";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for getQuestionById", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given an existing questionId", () => {
    it("should return the question with the given questionId", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.question.findUnique = jest
        .fn()
        .mockResolvedValue(Response.getQuestionByIdDbResponse(questionId));

      // Act
      const assignment = await GetHandler.getQuestionById(questionId);

      // Assert
      expect(assignment).toEqual(
        Response.getQuestionByIdExpectedResponse(questionId)
      );
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      dbMock.question.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const assignment = await GetHandler.getQuestionById(questionId);

      // Assert
      expect(assignment).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const questionId = "existing-question-id";
      dbMock.question.findUnique = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act & Assert
      await expect(GetHandler.getQuestionById(questionId)).rejects.toThrow(
        "Database is down"
      );
    });
  });
});

describe("Unit Tests for GET /assignment/api/questions/:id", () => {
  const app = createUnitTestServer();

  describe("Given an existing questionId", () => {
    it("should return the question with the given questionId", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(GetHandler, "getQuestionById")
        .mockResolvedValue(
          Response.getQuestionByIdExpectedResponse(questionId)
        );

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/questions/${questionId}`
      );

      // Assert
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual(
        Response.getQuestionByIdExpectedResponse(questionId)
      );

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return 404", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const spy = jest
        .spyOn(GetHandler, "getQuestionById")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/questions/${questionId}`
      );

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
    it("should return 500", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const spy = jest
        .spyOn(GetHandler, "getQuestionById")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/questions/${questionId}`
      );

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
