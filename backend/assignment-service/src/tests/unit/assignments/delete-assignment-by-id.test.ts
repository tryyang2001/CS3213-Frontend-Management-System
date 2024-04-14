import supertest from "supertest";
import db from "../../../models/db";
import { DeleteHandler } from "../../../services/assignments/delete-handler";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for deleteAssignmentById", () => {
  const dbMock = db as jest.Mocked<typeof db>;
  describe("Given an existing assignment id", () => {
    it("should delete the assignment and return the deleted assignment", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      dbMock.assignment.findUnique = jest.fn().mockResolvedValue({
        id: assignmentId,
      });
      dbMock.assignment.delete = jest
        .fn()
        .mockResolvedValue(Response.getAssignmentByIdDbResponse(assignmentId));

      // Act
      const deletedAssignment =
        await DeleteHandler.deleteAssignmentById(assignmentId);

      // Assert
      expect(deletedAssignment).not.toBeNull();

      if (deletedAssignment) {
        expect(deletedAssignment.id).toBe(assignmentId);
      }
    });
  });

  describe("Given a non-existing assignment id", () => {
    it("should return null", async () => {
      // Arrange
      const assignmentId = "non-existing-assignment-id";
      dbMock.assignment.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const deletedAssignment =
        await DeleteHandler.deleteAssignmentById(assignmentId);

      // Assert
      expect(deletedAssignment).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      dbMock.assignment.findUnique = jest.fn().mockResolvedValue({
        id: assignmentId,
      });
      dbMock.assignment.delete = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const apiCall = DeleteHandler.deleteAssignmentById(assignmentId);

      // Assert
      await expect(apiCall).rejects.toThrow("Database is down");
    });
  });
});

describe("Unit Tests for DELETE /assignment/api/assignments/:id", () => {
  const app = createUnitTestServer();

  describe("Given an existing assignment id", () => {
    it("should delete the assignment and return 204", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const spy = jest
        .spyOn(DeleteHandler, "deleteAssignmentById")
        .mockResolvedValue(
          Response.getAssignmentByIdExpectedResponse(assignmentId)
        );

      // Act
      const response = await supertest(app).delete(
        `${API_PREFIX}/assignments/${assignmentId}`
      );

      // Assert
      expect(response.status).toBe(HttpStatusCode.NO_CONTENT);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-existing assignment id", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const assignmentId = "non-existing-assignment-id";
      const spy = jest
        .spyOn(DeleteHandler, "deleteAssignmentById")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app).delete(
        `${API_PREFIX}/assignments/${assignmentId}`
      );

      // Assert
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Assignment not found",
      });

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given database is down", () => {
    it("should return 500 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const spy = jest
        .spyOn(DeleteHandler, "deleteAssignmentById")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app).delete(
        `${API_PREFIX}/assignments/${assignmentId}`
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
