import supertest from "supertest";
import db from "../../../models/db";
import { PutHandler } from "../../../services/questions/put-handler";
import * as Request from "../../payloads/requests";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for updateQuestionReferenceSolution", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given an existing questionId and a valid updateQuestionReferenceSolutionBody", () => {
    it("should update the question reference solution and return it", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionReferenceSolutionBody = {
        id: questionId,
        ...Request.getUpdateQuestionReferenceSolutionRequestBody(),
      };

      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
        referenceSolutionId: "existing-reference-solution-id",
      });
      dbMock.referenceSolution.update = jest
        .fn()
        .mockResolvedValue(Response.getUpdatedReferenceSolutionDbResponse());

      // Act
      const updatedReferenceSolution =
        await PutHandler.updateQuestionReferenceSolution(
          updateQuestionReferenceSolutionBody
        );

      // Assert
      expect(dbMock.question.findUnique).toHaveBeenCalledTimes(1);
      expect(dbMock.referenceSolution.update).toHaveBeenCalledTimes(1);
      expect(updatedReferenceSolution).toEqual(
        Response.getUpdatedReferenceSolutionExpectedResponse()
      );
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const updateQuestionReferenceSolutionBody = {
        id: questionId,
        ...Request.getUpdateQuestionReferenceSolutionRequestBody(),
      };

      dbMock.question.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const updatedReferenceSolution =
        await PutHandler.updateQuestionReferenceSolution(
          updateQuestionReferenceSolutionBody
        );

      // Assert
      expect(dbMock.question.findUnique).toHaveBeenCalledTimes(1);
      expect(updatedReferenceSolution).toBeNull();
    });
  });

  describe("Given an existing questionId without a reference solution", () => {
    it("should return null", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionReferenceSolutionBody = {
        id: questionId,
        ...Request.getUpdateQuestionReferenceSolutionRequestBody(),
      };

      dbMock.question.findUnique = jest.fn().mockResolvedValue({
        id: questionId,
        referenceSolutionId: null,
      });

      // Act
      const updatedReferenceSolution =
        await PutHandler.updateQuestionReferenceSolution(
          updateQuestionReferenceSolutionBody
        );

      // Assert
      expect(dbMock.question.findUnique).toHaveBeenCalledTimes(1);
      expect(updatedReferenceSolution).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionReferenceSolutionBody = {
        id: questionId,
        ...Request.getUpdateQuestionReferenceSolutionRequestBody(),
      };

      dbMock.question.findUnique = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act & Assert
      await expect(
        PutHandler.updateQuestionReferenceSolution(
          updateQuestionReferenceSolutionBody
        )
      ).rejects.toThrow("Database is down");
    });
  });
});

describe("Unit Tests for PUT /assignment/api/questions/:id/solution", () => {
  const app = createUnitTestServer();

  describe("Given an existing questionId and a valid updateQuestionReferenceSolutionBody", () => {
    it("should return 200 and the updated reference solution", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionReferenceSolutionBody =
        Request.getUpdateQuestionReferenceSolutionRequestBody();

      const spy = jest
        .spyOn(PutHandler, "updateQuestionReferenceSolution")
        .mockResolvedValue(
          Response.getUpdatedReferenceSolutionExpectedResponse()
        );

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(updateQuestionReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.OK);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(
        Response.getUpdatedReferenceSolutionExpectedResponse()
      );

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-supported language in the updateQuestionReferenceSolutionBody", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionReferenceSolutionBody = {
        ...Request.getUpdateQuestionReferenceSolutionRequestBody(),
        language: "non-supported-language",
      };

      const spy = jest
        .spyOn(PutHandler, "updateQuestionReferenceSolution")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(updateQuestionReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(spy).toHaveBeenCalledTimes(0);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: `Only python and c languages are supported`,
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given language field is missing in the updateQuestionReferenceSolutionBody", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionReferenceSolutionBody = {
        ...Request.getUpdateQuestionReferenceSolutionRequestBody(),
        language: undefined,
      };

      const spy = jest
        .spyOn(PutHandler, "updateQuestionReferenceSolution")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(updateQuestionReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(spy).toHaveBeenCalledTimes(0);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: `Language is required.`,
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-existing questionId", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const questionId = "non-existing-question-id";
      const updateQuestionReferenceSolutionBody =
        Request.getUpdateQuestionReferenceSolutionRequestBody();

      const spy = jest
        .spyOn(PutHandler, "updateQuestionReferenceSolution")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(updateQuestionReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: `Reference solution or question not found`,
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given the database is down", () => {
    it("should return 500 with an error message", async () => {
      // Arrange
      const questionId = "existing-question-id";
      const updateQuestionReferenceSolutionBody =
        Request.getUpdateQuestionReferenceSolutionRequestBody();

      const spy = jest
        .spyOn(PutHandler, "updateQuestionReferenceSolution")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/questions/${questionId}/solution`)
        .send(updateQuestionReferenceSolutionBody);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has ocurred. Please try again later",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });
});
