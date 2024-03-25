import supertest from "supertest";
import db from "../../../models/db";
import { PostHandler } from "../../../services/questions/post-handler";
import * as Request from "../../payloads/requests";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for createQuestionTestCases", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given a valid createQuestionTestCasesBody", () => {
    it("should create the test cases and link to the question", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createTestCasesBody = {
        questionId,
        ...Request.getCreateQuestionTestCasesRequestBody(),
      };

      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.testCase.createMany = jest.fn().mockResolvedValue({
        count: createTestCasesBody.testCases.length,
      });
      dbMock.question.update = jest.fn().mockResolvedValue(null);

      // Act
      const createdTestCases =
        await PostHandler.createQuestionTestCases(createTestCasesBody);

      // Assert
      expect(dbMock.question.findUnique).toHaveBeenCalledTimes(1);
      expect(dbMock.testCase.createMany).toHaveBeenCalledTimes(1);
      expect(dbMock.question.update).toHaveBeenCalledTimes(1);
      expect(createdTestCases?.count).toEqual(
        createTestCasesBody.testCases.length
      );
      expect(createdTestCases?.testCases).toEqual(
        createTestCasesBody.testCases
      );
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const createTestCasesBody = {
        questionId,
        ...Request.getCreateQuestionTestCasesRequestBody(),
      };

      dbMock.question.findUnique = jest.fn().mockResolvedValue(null);
      dbMock.testCase.createMany = jest.fn().mockResolvedValue(null);
      dbMock.question.update = jest.fn().mockResolvedValue(null);

      // Act
      const createdTestCases =
        await PostHandler.createQuestionTestCases(createTestCasesBody);

      // Assert
      expect(dbMock.question.findUnique).toHaveBeenCalledTimes(1);
      expect(dbMock.testCase.createMany).toHaveBeenCalledTimes(0);
      expect(dbMock.question.update).toHaveBeenCalledTimes(0);
      expect(createdTestCases).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createTestCasesBody = {
        questionId,
        ...Request.getCreateQuestionTestCasesRequestBody(),
      };

      dbMock.question.findUnique = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act & Assert
      await expect(
        PostHandler.createQuestionTestCases(createTestCasesBody)
      ).rejects.toThrow("Database is down");
    });
  });
});

describe("Unit Tests for POST /assignment/api/questions/:questionId/test-cases", () => {
  const app = createUnitTestServer();

  describe("Given an existing questionId with valid test cases array in the request body", () => {
    it("should return 200 and added the test cases", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createTestCasesBody =
        Request.getCreateQuestionTestCasesRequestBody();

      const spy = jest
        .spyOn(PostHandler, "createQuestionTestCases")
        .mockResolvedValue(Response.getCreatedTestCasesExpectedResponse());

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send(createTestCasesBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.CREATED);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(
        Response.getCreatedTestCasesExpectedResponse()
      );

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the test cases array is empty", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createTestCasesBody = {
        testCases: [],
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send(createTestCasesBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid testCases. Array must contain at least 1 element(s)",
      });
    });
  });

  describe("Given the test case input is non-string", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createTestCasesBody = {
        testCases: [
          {
            input: 123,
            output: "output",
          },
        ],
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send(createTestCasesBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid testCases. Expected string, received number",
      });
    });
  });

  describe("Given the test case input is too long (>10000 characters)", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createTestCasesBody = {
        testCases: [
          {
            input: "a".repeat(10001),
            output: "output",
          },
        ],
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send(createTestCasesBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message:
          "Invalid testCases. String must contain at most 10000 character(s)",
      });
    });
  });

  describe("Given the request body is empty", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send({});

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Request body is empty",
      });
    });
  });

  describe("Given the request body contains extra fields", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createTestCasesBody = {
        ...Request.getCreateQuestionTestCasesRequestBody(),
        extraField: "extra-field",
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send(createTestCasesBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Request body must contain only the required fields",
      });
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const createTestCasesBody =
        Request.getCreateQuestionTestCasesRequestBody();

      const spy = jest
        .spyOn(PostHandler, "createQuestionTestCases")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send(createTestCasesBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: `Question not found`,
      });
    });
  });

  describe("Given the database is down", () => {
    it("should return 500 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createTestCasesBody =
        Request.getCreateQuestionTestCasesRequestBody();

      const spy = jest
        .spyOn(PostHandler, "createQuestionTestCases")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/test-cases`)
        .send(createTestCasesBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has ocurred. Please try again later",
      });
    });
  });
});
