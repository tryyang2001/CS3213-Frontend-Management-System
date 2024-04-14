import db from "../../../models/db";
import { GetHandler } from "../../../services/assignments/get-handler";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";
import createUnitTestServer from "../../utils/create-test-server-utils";
import supertest from "supertest";
import * as Response from "../../payloads/responses";
import { Assignment } from "../../../types/assignment";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for getAssignmentById", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given an existing assignment id", () => {
    it("should return the assignment with the given id", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      dbMock.assignment.findUnique = jest
        .fn()
        .mockResolvedValue(Response.getAssignmentByIdDbResponse(assignmentId));

      // Act
      const assignment = await GetHandler.getAssignmentById(assignmentId);

      // Assert
      assertAssignment(assignment);
    });
  });

  describe("Given an existing assignment with no reference solution", () => {
    it("should return the assignment with reference solution as undefined", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      dbMock.assignment.findUnique = jest.fn().mockResolvedValue({
        id: assignmentId,
        title: "Assignment 1",
        deadline: new Date("2024-12-31T00:00:00.000Z"),
        authors: ["existing-user-id"],
        isPublished: true,
        numberOfQuestions: 2,
        createdOn: new Date("2024-03-12T00:00:00.000Z"),
        updatedOn: new Date("2024-03-12T00:00:00.000Z"),
        questions: [
          {
            id: "question-id-1",
            title: "Question 1",
            description: "Description 1",
            deadline: new Date("2024-12-31T00:00:00.000Z"),
            numberOfTestCases: 1,
            referenceSolutionId: null,
            createdOn: new Date("2024-03-12T00:00:00.000Z"),
          },
          {
            id: "question-id-2",
            title: "Question 2",
            description: "Description 2",
            deadline: new Date("2024-12-31T00:00:00.000Z"),
            numberOfTestCases: 2,
            referenceSolutionId: null,
            createdOn: new Date("2024-03-12T00:00:00.000Z"),
          },
        ],
      });

      // Act
      const assignment = await GetHandler.getAssignmentById(assignmentId);

      // Assert
      expect(assignment).not.toBeNull();
    });
  });

  describe("Given a non-existing assignment id", () => {
    it("should return null", async () => {
      // Arrange
      const assignmentId = "non-existing-assignment-id";
      dbMock.assignment.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const assignment = await GetHandler.getAssignmentById(assignmentId);

      // Assert
      expect(assignment).toBeNull();
    });
  });

  describe("Given database is down", () => {
    it("should throws an error", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      dbMock.assignment.findUnique = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const apiCall = GetHandler.getAssignmentById(assignmentId);

      // Assert
      await expect(apiCall).rejects.toMatchObject(
        new Error("Database is down")
      );
    });
  });
});

describe("Unit Tests for GET /assignment/api/assignments/:id", () => {
  const app = createUnitTestServer();
  const assignmentServiceMock = GetHandler as jest.Mocked<typeof GetHandler>;

  describe("Given an existing assignment id", () => {
    it("should return 200 and the assignment with questions", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const spy = jest
        .spyOn(GetHandler, "getAssignmentById")
        .mockResolvedValue(
          Response.getAssignmentByIdExpectedResponse(assignmentId)
        );

      // Act
      const response = await supertest(app).get(
        `${API_PREFIX}/assignments/${assignmentId}`
      );

      // Assert
      expect(response.status).toBe(HttpStatusCode.OK);
      assertAssignment(response.body as Assignment);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a non-existing assignment id", () => {
    it("should return 404 and an error message", async () => {
      // Arrange
      const assignmentId = "non-existing-assignment-id";
      const spy = jest
        .spyOn(GetHandler, "getAssignmentById")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app).get(
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

  describe("Given the database is down", () => {
    it("should return 500 and an error message", async () => {
      // Arrange
      const assignmentId = "existing-assignment-id";
      const spy = jest
        .spyOn(GetHandler, "getAssignmentById")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app).get(
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

function assertAssignment(assignment: Assignment | null) {
  expect(assignment).not.toBeNull();

  if (assignment) {
    expect(assignment.id).toEqual("existing-assignment-id");
    expect(assignment.title).toEqual("Assignment 1");
    expect(assignment.deadline).toEqual(
      new Date("2024-12-31T00:00:00.000Z").getTime()
    );
    expect(assignment.authors).toEqual([1]);
    expect(assignment.isPublished).toBeTruthy();
    expect(assignment.numberOfQuestions).toEqual(2);
    expect(assignment.createdOn).toEqual(
      new Date("2024-03-12T00:00:00.000Z").getTime()
    );
    expect(assignment.updatedOn).toEqual(
      new Date("2024-03-12T00:00:00.000Z").getTime()
    );
    expect(assignment.questions).toHaveLength(2);
    assignment.questions?.forEach((question, index) => {
      expect(question.id).toEqual(`question-id-${index + 1}`);
      expect(question.title).toEqual(`Question ${index + 1}`);
      expect(question.description).toEqual(`Description ${index + 1}`);
      expect(question.deadline).toEqual(
        new Date(`2024-12-31T00:00:00.000Z`).getTime()
      );
      expect(question.numberOfTestCases).toEqual(index + 1);
      expect(question.referenceSolutionId).toEqual(`solution-id-${index + 1}`);
    });
  }
}
