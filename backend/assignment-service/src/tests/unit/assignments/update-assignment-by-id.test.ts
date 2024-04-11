import supertest from "supertest";
import { UpdateAssignmentBody } from "../../../libs/validators/assignments/update-assignment-validator";
import db from "../../../models/db";
import { PutHandler } from "../../../services/assignments/put-handler";
import * as Request from "../../payloads/requests";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for updateAssignmentById", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given valid assignment params", () => {
    it("should update the assignment and return the updated assignment", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {
        assignmentId: assignmentId,
        ...Request.getUpdateAssignmentRequestBody(),
      } as UpdateAssignmentBody;

      dbMock.assignment.update = jest
        .fn()
        .mockResolvedValue(Response.getUpdatedAssignmentDbResponse());

      // Act
      const updatedAssignment = await PutHandler.updateAssignment(requestBody);

      // Assert
      expect(updatedAssignment).toEqual(
        Response.getUpdatedAssignmentResponse()
      );
    });
  });

  describe("Given the update assignment body has no deadline specified", () => {
    it("should still allow update and return the updated assignment", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {
        assignmentId: assignmentId,
        ...Request.getUpdateAssignmentRequestBody(),
        deadline: undefined,
      } as UpdateAssignmentBody;

      dbMock.assignment.update = jest
        .fn()
        .mockResolvedValue(Response.getUpdatedAssignmentDbResponse());

      // Act
      const updatedAssignment = await PutHandler.updateAssignment(requestBody);

      // Assert
      expect(updatedAssignment).toEqual(
        Response.getUpdatedAssignmentResponse()
      );
    });
  });

  describe("Given a non-existing assignment id", () => {
    it("should return null", async () => {
      // Arrange
      const assignmentId = "non-existing-assignment-id";
      const requestBody = {
        assignmentId: assignmentId,
        ...Request.getUpdateAssignmentRequestBody(),
      } as UpdateAssignmentBody;

      dbMock.assignment.update = jest.fn().mockResolvedValue(null);

      // Act
      const updatedAssignment = await PutHandler.updateAssignment(requestBody);

      // Assert
      expect(updatedAssignment).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {
        assignmentId: assignmentId,
        ...Request.getUpdateAssignmentRequestBody(),
      } as UpdateAssignmentBody;

      dbMock.assignment.update = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act and Assert
      await expect(PutHandler.updateAssignment(requestBody)).rejects.toThrow(
        "Database is down"
      );
    });
  });
});

describe("Unit Tests for PUT /assignment/api/assignments/:id", () => {
  const app = createUnitTestServer();

  describe("Given an existing assignment id with a valid request body", () => {
    it("should return 200 and the updated assignment", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = Request.getUpdateAssignmentRequestBody();

      const spy = jest
        .spyOn(PutHandler, "updateAssignment")
        .mockResolvedValue(Response.getUpdatedAssignmentResponse());

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/assignments/${assignmentId}`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual(Response.getUpdatedAssignmentResponse());

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given title to update is too short/empty", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {
        ...Request.getUpdateAssignmentRequestBody(),
        title: "",
      };

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/assignments/${assignmentId}`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: `Invalid title. String must contain at least 1 character(s)`,
      });
    });
  });

  describe("Given the title to update is too long (> 255 characters)", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {
        ...Request.getUpdateAssignmentRequestBody(),
        title: "a".repeat(256),
      };

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/assignments/${assignmentId}`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: `Invalid title. String must contain at most 255 character(s)`,
      });
    });
  });

  describe("Given the deadline to update is in the past", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {
        ...Request.getUpdateAssignmentRequestBody(),
        deadline: new Date("2020-12-31T23:59:59.998Z").getTime(),
      };

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/assignments/${assignmentId}`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: `Deadline must be in the future`,
      });
    });
  });

  describe("Given deadline is a negative number", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {
        ...Request.getUpdateAssignmentRequestBody(),
        deadline: -1,
      };

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/assignments/${assignmentId}`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: `Invalid deadline. Number must be greater than 0`,
      });
    });
  });

  describe("Given deadline is a floating point number", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {
        ...Request.getUpdateAssignmentRequestBody(),
        deadline: 1.5,
      };

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/assignments/${assignmentId}`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: `Invalid deadline. Expected integer, received float`,
      });
    });
  });

  describe("Given authors to update is an empty array", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {
        ...Request.getUpdateAssignmentRequestBody(),
        authors: [],
      };

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/assignments/${assignmentId}`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: `Invalid authors. At least one author is required`,
      });
    });
  });

  describe("Given a non-existing assignment id", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const assignmentId = "non-existing-assignment-id";
      const requestBody = Request.getUpdateAssignmentRequestBody();

      const spy = jest
        .spyOn(PutHandler, "updateAssignment")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/assignments/${assignmentId}`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: `Assignment not found`,
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given an empty request body", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {};

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/assignments/${assignmentId}`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: `Request body is empty`,
      });
    });
  });

  describe("Given a request body with additional fields", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const requestBody = {
        ...Request.getUpdateAssignmentRequestBody(),
        additionalField: "additional field",
      };

      // Act
      const response = await supertest(app)
        .put(`${API_PREFIX}/assignments/${assignmentId}`)
        .send(requestBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: `Request body must contain only the required fields`,
      });
    });
  });
});
