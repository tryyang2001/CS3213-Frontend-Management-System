import supertest from "supertest";
import db from "../../../models/db";
import { PostHandler } from "../../../services/questions/post-handler";
import * as Request from "../../payloads/requests";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";
import DuplicateReferenceSolutionError from "../../../libs/errors/DuplicateReferenceSolutionError";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for createQuestionReferenceSolution", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given a valid createQuestionReferenceSolutionBody", () => {
    it("should create the reference solution and link to the question", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createReferenceSolutionBody = {
        id: questionId,
        ...Request.getCreateQuestionReferenceSolutionRequestBody(),
      };

      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.referenceSolution.create = jest
        .fn()
        .mockResolvedValue(Response.getCreatedReferenceSolutionDbResponse());
      dbMock.question.update = jest.fn().mockResolvedValue(null);

      // Act
      const createdReferenceSolution =
        await PostHandler.createQuestionReferenceSolution(
          createReferenceSolutionBody
        );

      // Assert
      expect(dbMock.question.findUnique).toHaveBeenCalledTimes(1);
      expect(dbMock.referenceSolution.create).toHaveBeenCalledTimes(1);
      expect(dbMock.question.update).toHaveBeenCalledTimes(1);
      expect(createdReferenceSolution).toEqual(
        Response.getCreatedReferenceSolutionExpectedResponse()
      );
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const createReferenceSolutionBody = {
        id: questionId,
        ...Request.getCreateQuestionReferenceSolutionRequestBody(),
      };

      dbMock.question.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const createdReferenceSolution =
        await PostHandler.createQuestionReferenceSolution(
          createReferenceSolutionBody
        );

      // Assert
      expect(dbMock.question.findUnique).toHaveBeenCalledTimes(1);
      expect(createdReferenceSolution).toBeNull();
    });
  });

  describe("Given the reference solution already exists", () => {
    it("should throw DuplicateReferenceSolutionError", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createReferenceSolutionBody = {
        id: questionId,
        ...Request.getCreateQuestionReferenceSolutionRequestBody(),
      };

      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
        referenceSolutionId: "existing-reference-solution-id",
      });

      // Act & Assert
      await expect(
        PostHandler.createQuestionReferenceSolution(createReferenceSolutionBody)
      ).rejects.toThrow(
        `Reference solution for question ${questionId} already exists`
      );
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createReferenceSolutionBody = {
        id: questionId,
        ...Request.getCreateQuestionReferenceSolutionRequestBody(),
      };

      dbMock.question.findUnique = jest.fn().mockReturnValue({
        id: questionId,
      });
      dbMock.referenceSolution.create = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act & Assert
      await expect(
        PostHandler.createQuestionReferenceSolution(createReferenceSolutionBody)
      ).rejects.toThrow("Database is down");
    });
  });
});

describe("Unit Tests for POST /assignment/api/questions/:id/solution", () => {
  const app = createUnitTestServer();

  describe("Given a valid request body with existing questionId which does not have existing reference solution", () => {
    it("should create the reference solution and link to the question", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createReferenceSolutionBody =
        Request.getCreateQuestionReferenceSolutionRequestBody();

      const spy = jest
        .spyOn(PostHandler, "createQuestionReferenceSolution")
        .mockResolvedValue(
          Response.getCreatedReferenceSolutionExpectedResponse()
        );

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(createReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.CREATED);
      expect(response.body).toEqual(
        Response.getCreatedReferenceSolutionExpectedResponse()
      );
      expect(spy).toHaveBeenCalledTimes(1);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the language is py (short form of python)", () => {
    it("should return 201 and create the reference solution", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createReferenceSolutionBody = {
        ...Request.getCreateQuestionReferenceSolutionRequestBody(),
        language: "py",
      };

      const spy = jest
        .spyOn(PostHandler, "createQuestionReferenceSolution")
        .mockResolvedValue(
          Response.getCreatedReferenceSolutionExpectedResponse()
        );

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(createReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.CREATED);
      expect(response.body).toEqual(
        Response.getCreatedReferenceSolutionExpectedResponse()
      );
      expect(spy).toHaveBeenCalledTimes(1);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-supported language in the createReferenceSolutionBody", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createReferenceSolutionBody = {
        ...Request.getCreateQuestionReferenceSolutionRequestBody(),
        language: "non-supported-language",
      };
      const spy = jest
        .spyOn(PostHandler, "createQuestionReferenceSolution")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(createReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Only python and c languages are supported",
      });
      expect(spy).toHaveBeenCalledTimes(0);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const createReferenceSolutionBody =
        Request.getCreateQuestionReferenceSolutionRequestBody();
      const spy = jest
        .spyOn(PostHandler, "createQuestionReferenceSolution")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(createReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Question not found",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the reference solution already exists", () => {
    it("should return 409 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createReferenceSolutionBody =
        Request.getCreateQuestionReferenceSolutionRequestBody();
      const spy = jest
        .spyOn(PostHandler, "createQuestionReferenceSolution")
        .mockRejectedValue(new DuplicateReferenceSolutionError(questionId));

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(createReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.CONFLICT);
      expect(response.body).toEqual({
        error: "CONFLICT",
        message: `Reference solution for question ${questionId} already exists`,
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given an empty request body", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createReferenceSolutionBody = {};
      const spy = jest
        .spyOn(PostHandler, "createQuestionReferenceSolution")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(createReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Request body is empty",
      });
      expect(spy).toHaveBeenCalledTimes(0);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the request body contains extra fields", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createReferenceSolutionBody = {
        ...Request.getCreateQuestionReferenceSolutionRequestBody(),
        extraField: "extra-field",
      };
      const spy = jest
        .spyOn(PostHandler, "createQuestionReferenceSolution")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(createReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Request body must contain only the required fields",
      });
      expect(spy).toHaveBeenCalledTimes(0);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the database is down", () => {
    it("should return 500 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const createReferenceSolutionBody =
        Request.getCreateQuestionReferenceSolutionRequestBody();
      const spy = jest
        .spyOn(PostHandler, "createQuestionReferenceSolution")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(createReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has ocurred. Please try again later",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });
});
