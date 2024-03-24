import supertest from "supertest";
import db from "../../../models/db";
import { PostHandler } from "../../../services/assignments/post-handler";
import * as Request from "../../payloads/requests";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for createAssignment", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given a valid request body", () => {
    it("should create an assignment in the database and return it", async () => {
      // Arrange
      const createAssignmentBody = Request.getCreateAssignmentRequestBody();
      dbMock.assignment.create = jest
        .fn()
        .mockResolvedValue(Response.getCreatedAssignmentDbResponse());

      // Act
      const assignment =
        await PostHandler.createAssignment(createAssignmentBody);

      // Assert
      expect(assignment).toEqual(
        Response.getCreatedAssignmentExpectedResponse()
      );
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const createAssignmentBody = Request.getCreateAssignmentRequestBody();
      dbMock.assignment.create = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act and Assert
      await expect(
        PostHandler.createAssignment(createAssignmentBody)
      ).rejects.toThrow("Database is down");
    });
  });
});

describe("Unit Tests for POST /assignment/api/assignments", () => {
  const app = createUnitTestServer();

  describe("Given a valid request body", () => {
    it("should return 201 and the created assignment", async () => {
      // Arrange
      const requestBody = Request.getCreateAssignmentRequestBody();
      const spy = jest
        .spyOn(PostHandler, "createAssignment")
        .mockResolvedValue(Response.getCreatedAssignmentExpectedResponse());

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(response.body).toEqual(
        Response.getCreatedAssignmentExpectedResponse()
      );

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a request body with a deadline in the past", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const requestBody = {
        ...Request.getCreateAssignmentRequestBody(),
        deadline: new Date("2024-01-01T00:00:00.000Z").getTime(),
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Deadline must be in the future",
      });
    });
  });

  describe("Given a request body with negative deadline value", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const requestBody = {
        ...Request.getCreateAssignmentRequestBody(),
        deadline: -1,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid deadline. Number must be greater than 0",
      });
    });
  });

  describe("Given a request body with deadline having floating point value", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const requestBody = {
        ...Request.getCreateAssignmentRequestBody(),
        deadline: 1.5,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid deadline. Expected integer, received float",
      });
    });
  });

  describe("Given a request body with no author", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const requestBody = {
        ...Request.getCreateAssignmentRequestBody(),
        authors: [],
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid authors. At least one author is required",
      });
    });
  });

  describe("Given an empty request body", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const requestBody = {};

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Request body is empty",
      });
    });
  });

  describe("Given a request body with additional fields", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const requestBody = {
        ...Request.getCreateAssignmentRequestBody(),
        extra: "extraField",
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Request body must contain only the required fields",
      });
    });
  });

  describe("Given the database is down", () => {
    it("should return 500 and an error message", async () => {
      // Arrange
      const requestBody = Request.getCreateAssignmentRequestBody();
      const spy = jest
        .spyOn(PostHandler, "createAssignment")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments`)
        .send(requestBody);

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
