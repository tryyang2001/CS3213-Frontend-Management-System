import supertest from "supertest";
import db from "../../../models/db";
import { PutHandler } from "../../../services/questions/put-handler";
import * as Request from "../../payloads/requests";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for updateQuestionById", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given an existing questionId with valid updateQuestionBody", () => {
    it("should update the question and return the updated question", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = {
        questionId,
        ...Request.getUpdateQuestionRequestBody(),
      };
      dbMock.question.update = jest
        .fn()
        .mockResolvedValue(Response.getUpdatedQuestionDbResponse());
      dbMock.assignment.update = jest.fn().mockResolvedValue(null);

      // Act
      const updatedQuestion =
        await PutHandler.updateQuestionById(updateQuestionBody);

      // Assert
      expect(dbMock.question.update).toHaveBeenCalledTimes(1);
      expect(dbMock.assignment.update).toHaveBeenCalledTimes(1);
      expect(updatedQuestion).toEqual(
        Response.getUpdatedQuestionExpectedResponse()
      );
    });
  });

  describe("Given an existing questionId with valid updateQuestionBody but without title", () => {
    it("should update the question without modifying the assignment deadline", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = {
        questionId,
        ...Request.getUpdateQuestionRequestBody(),
        title: undefined,
      };
      dbMock.question.update = jest
        .fn()
        .mockResolvedValue(Response.getUpdatedQuestionDbResponse());
      dbMock.assignment.update = jest.fn().mockResolvedValue(null);

      // Act
      const updatedQuestion =
        await PutHandler.updateQuestionById(updateQuestionBody);

      // Assert
      expect(dbMock.question.update).toHaveBeenCalledTimes(1);
      expect(dbMock.assignment.update).toHaveBeenCalledTimes(1);
      expect(updatedQuestion).toEqual(
        Response.getUpdatedQuestionExpectedResponse()
      );
    });
  });

  describe("Given an existing questionId with valid updateQuestionBody but without description", () => {
    it("should update the question without modifying the assignment deadline", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = {
        questionId,
        ...Request.getUpdateQuestionRequestBody(),
        description: undefined,
      };
      dbMock.question.update = jest
        .fn()
        .mockResolvedValue(Response.getUpdatedQuestionDbResponse());
      dbMock.assignment.update = jest.fn().mockResolvedValue(null);

      // Act
      const updatedQuestion =
        await PutHandler.updateQuestionById(updateQuestionBody);

      // Assert
      expect(dbMock.question.update).toHaveBeenCalledTimes(1);
      expect(dbMock.assignment.update).toHaveBeenCalledTimes(1);
      expect(updatedQuestion).toEqual(
        Response.getUpdatedQuestionExpectedResponse()
      );
    });
  });

  describe("Given an existing questionId with valid updateQuestionBody but without deadline", () => {
    it("should update the question without modifying the assignment deadline", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = {
        questionId,
        ...Request.getUpdateQuestionRequestBody(),
        deadline: undefined,
      };
      dbMock.question.update = jest
        .fn()
        .mockResolvedValue(Response.getUpdatedQuestionDbResponse());
      dbMock.assignment.update = jest.fn().mockResolvedValue(null);

      // Act
      const updatedQuestion =
        await PutHandler.updateQuestionById(updateQuestionBody);

      // Assert
      expect(dbMock.question.update).toHaveBeenCalledTimes(1);
      expect(dbMock.assignment.update).toHaveBeenCalledTimes(0);
      expect(updatedQuestion).toEqual(
        Response.getUpdatedQuestionExpectedResponse()
      );
    });
  });

  describe("Given a non-existing questionId with valid updateQuestionBody", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const updateQuestionBody = {
        questionId,
        ...Request.getUpdateQuestionRequestBody(),
      };
      dbMock.question.update = jest.fn().mockResolvedValue(null);

      // Act
      const updatedQuestion =
        await PutHandler.updateQuestionById(updateQuestionBody);

      // Assert
      expect(dbMock.question.update).toHaveBeenCalledTimes(1);
      expect(updatedQuestion).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = {
        questionId,
        ...Request.getUpdateQuestionRequestBody(),
      };
      dbMock.question.update = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act & Assert
      await expect(
        PutHandler.updateQuestionById(updateQuestionBody)
      ).rejects.toThrow("Database is down");
    });
  });
});

describe("Unit Tests for PUT /assignment/api/questions/:questionId", () => {
  const app = createUnitTestServer();

  describe("Given an existing questionId with valid updateQuestionBody", () => {
    it("should return 200 with the updated question", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = Request.getUpdateQuestionRequestBody();

      const spy = jest
        .spyOn(PutHandler, "updateQuestionById")
        .mockResolvedValue(Response.getUpdatedQuestionExpectedResponse());

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send(updateQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(
        Response.getUpdatedQuestionExpectedResponse()
      );

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the title to update is empty string", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = Request.getUpdateQuestionRequestBody();
      updateQuestionBody.title = "";

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send(updateQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid title. String must contain at least 1 character(s)",
      });
    });
  });

  describe("Given the title to update is too long (>255 characters)", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = Request.getUpdateQuestionRequestBody();
      updateQuestionBody.title = "a".repeat(256);

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send(updateQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid title. String must contain at most 255 character(s)",
      });
    });
  });

  describe("Given the deadline to update is in the past", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = Request.getUpdateQuestionRequestBody();
      updateQuestionBody.deadline = new Date(
        "2020-12-31T23:59:59.999Z"
      ).getTime();

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send(updateQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Deadline must be in the future",
      });
    });
  });

  describe("Given the deadline to update contains negative value", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = Request.getUpdateQuestionRequestBody();
      updateQuestionBody.deadline = -1;

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send(updateQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid deadline. Number must be greater than 0",
      });
    });
  });

  describe("Given the deadline to update contains floating point number", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = Request.getUpdateQuestionRequestBody();
      updateQuestionBody.deadline = 1.5;

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send(updateQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid deadline. Expected integer, received float",
      });
    });
  });

  describe("Given the deadline is a date string instead of timestamp", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = {
        deadline: "2024-12-31T23:59:59.999Z",
      };

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send(updateQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid deadline. Expected number, received string",
      });
    });
  });

  describe("Given the request body is empty", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send({});

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
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
      const updateQuestionBody = {
        ...Request.getUpdateQuestionRequestBody(),
        extraField: "extra field value",
      };

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send(updateQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Request body must contain only the required fields",
      });
    });
  });

  describe("Given a non-existing questionId with valid updateQuestionBody", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const updateQuestionBody = Request.getUpdateQuestionRequestBody();

      const spy = jest
        .spyOn(PutHandler, "updateQuestionById")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send(updateQuestionBody);

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);
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
    it("should return 500 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionBody = Request.getUpdateQuestionRequestBody();

      const spy = jest
        .spyOn(PutHandler, "updateQuestionById")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}`)
        .send(updateQuestionBody);

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);
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
