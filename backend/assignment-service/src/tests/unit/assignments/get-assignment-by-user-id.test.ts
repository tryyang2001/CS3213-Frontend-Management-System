import { Express } from "express";
import { PrismaClient } from "@prisma/client";
import db from "../../../models/db";
import { GetHandler } from "../../../services/assignments/get-handler";
import {
  ExpectedAssignmentsFromGetAssignmentsByUserId,
  GetAssignmentsByUserIdDbResponse,
} from "../../payloads/responses/assignments/get-assignments-response";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";
import createUnitTestServer from "../../utils/create-test-server-utils";
import supertest from "supertest";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for getAssignmentsByUserId", () => {
  let dbMock: PrismaClient;

  beforeEach(() => {
    dbMock = db as jest.Mocked<typeof db>;
  });

  describe("Given an existing user id", () => {
    it("should return the assignments associated with the user", async () => {
      // Arrange
      const userId = "existing-user-id-1";
      dbMock.assignment.findMany = jest
        .fn()
        .mockResolvedValue(GetAssignmentsByUserIdDbResponse(userId));

      // Act
      const assignments = await GetHandler.getAssignmentsByUserId(userId);

      // Assert
      expect(assignments).toEqual(
        ExpectedAssignmentsFromGetAssignmentsByUserId(userId)
      );
    });
  });
});

describe("Unit Tests for GET /assignments?userId=:userId", () => {
  let app: Express;

  beforeAll(() => {
    app = createUnitTestServer();
    jest.mock("../../../services/assignments/get-handler", () => ({
      GetHandler: {
        getAssignmentsByUserId: jest.fn(),
      },
    }));
  });

  describe("Given an existing user id", () => {
    it("should return 200 with the assignments in the request body", async () => {
      // Arrange
      const userId = "existing-user-id-1";
      GetHandler.getAssignmentsByUserId = jest
        .fn()
        .mockResolvedValue(
          ExpectedAssignmentsFromGetAssignmentsByUserId(userId)
        );

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/assignments?userId=${userId}`
      );

      // Assert
      expect(GetHandler.getAssignmentsByUserId).toHaveBeenCalledWith(userId);
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual({
        assignments: ExpectedAssignmentsFromGetAssignmentsByUserId(userId),
      });
    });
  });

  describe("Given the userId query param is missing", () => {
    it("should return 400 with an error message", async () => {
      // Act
      const response = await supertest(app).get(`${API_PREFIX}/assignments`);

      // Assert
      expect(response.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "userId is required in the query params",
      });
    });
  });

  describe("Given the userId does not exist in the database", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const userId = "non-existing-user-id-1";
      GetHandler.getAssignmentsByUserId = jest.fn().mockResolvedValue(null);

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/assignments?userId=${userId}`
      );

      // Assert
      expect(GetHandler.getAssignmentsByUserId).toHaveBeenCalledWith(userId);
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Assignments not found",
      });
    });
  });

  describe("Given the user id exists but has no assignments", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const userId = "existing-user-id-2";
      GetHandler.getAssignmentsByUserId = jest.fn().mockResolvedValue([]);

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/assignments?userId=${userId}`
      );

      // Assert
      expect(GetHandler.getAssignmentsByUserId).toHaveBeenCalledWith(userId);
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: "Assignments not found",
      });
    });
  });

  describe("Given an unexpected error occurs", () => {
    it("should return 500 and an error message", async () => {
      // Arrange
      const userId = "existing-user-id-1";
      GetHandler.getAssignmentsByUserId = jest
        .fn()
        .mockRejectedValue(
          new Error("Unexpected error likely due to database")
        );

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/assignments?userId=${userId}`
      );

      // Assert
      expect(GetHandler.getAssignmentsByUserId).toHaveBeenCalledWith(userId);
      expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has occurred. Please try again later",
      });
    });
  });
});
