import supertest from "supertest";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";
import db from "../../../models/db";
import { PostHandler } from "../../../services/questions/post-handler";
import * as Request from "../../payloads/requests";
import * as Response from "../../payloads/responses";
import createUnitTestServer from "../../utils/create-test-server-utils";

const API_PREFIX = "/assignment/api";

describe("Unit Tests for createQuestion", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given a valid createQuestionBody with question, test cases, and reference solution", () => {
    it("should create a question and return the created question", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        assignmentId,
        ...Request.getCreateQuestionRequestBody(),
      };
      dbMock.assignment.findUnique = jest.fn().mockResolvedValue({
        id: assignmentId,
      });
      dbMock.question.create = jest
        .fn()
        .mockResolvedValue(Response.getCreatedQuestionDbResponse());
      dbMock.question.update = jest.fn().mockResolvedValue(null);
      dbMock.assignment.update = jest.fn().mockResolvedValue({
        numberOfQuestions: 1,
      });

      // Act
      const createdQuestion =
        await PostHandler.createQuestion(createQuestionBody);

      // Assert
      expect(dbMock.assignment.findUnique).toHaveBeenCalledTimes(1);
      expect(dbMock.question.create).toHaveBeenCalledTimes(1);
      expect(dbMock.question.update).toHaveBeenCalledTimes(1);
      expect(dbMock.assignment.update).toHaveBeenCalledTimes(1);
      expect(createdQuestion).toEqual(
        Response.getCreatedQuestionExpectedResponse()
      );
    });
  });

  describe("Given a valid createQuestionBody with question and test cases but without reference solution", () => {
    it("should create a question without reference solution and return the created question", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        assignmentId,
        ...Request.getCreateQuestionRequestBody({
          includeReferenceSolution: false,
        }),
      };
      dbMock.assignment.findUnique = jest.fn().mockResolvedValue({
        id: assignmentId,
      });
      dbMock.question.create = jest
        .fn()
        .mockResolvedValue(Response.getCreatedQuestionDbResponse(false));
      dbMock.question.update = jest.fn().mockResolvedValue(null);
      dbMock.assignment.update = jest.fn().mockResolvedValue({
        numberOfQuestions: 1,
      });

      // Act
      const createdQuestion =
        await PostHandler.createQuestion(createQuestionBody);

      // Assert
      expect(dbMock.assignment.findUnique).toHaveBeenCalledTimes(1);
      expect(dbMock.question.create).toHaveBeenCalledTimes(1);
      expect(dbMock.question.update).toHaveBeenCalledTimes(0);
      expect(dbMock.assignment.update).toHaveBeenCalledTimes(1);
      expect(createdQuestion).toEqual(
        Response.getCreatedQuestionExpectedResponse(false)
      );
    });
  });

  describe("Given a valid createQuestionBody with question and reference solution but without test cases", () => {
    it("should create a question without test cases and return the created question", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        assignmentId,
        ...Request.getCreateQuestionRequestBody({
          includeTestCases: false,
        }),
      };

      dbMock.assignment.findUnique = jest.fn().mockResolvedValue({
        id: assignmentId,
      });
      dbMock.question.create = jest.fn().mockResolvedValue({
        ...Response.getCreatedQuestionDbResponse(),
        numberOfTestCases: 0,
      });
      dbMock.question.update = jest.fn().mockResolvedValue(null);
      dbMock.assignment.update = jest.fn().mockResolvedValue({
        numberOfQuestions: 1,
      });

      // Act
      const createdQuestion =
        await PostHandler.createQuestion(createQuestionBody);

      // Assert
      expect(dbMock.assignment.findUnique).toHaveBeenCalledTimes(1);
      expect(dbMock.question.create).toHaveBeenCalledTimes(1);
      expect(dbMock.question.update).toHaveBeenCalledTimes(1);
      expect(dbMock.assignment.update).toHaveBeenCalledTimes(1);
      expect(createdQuestion).toEqual({
        ...Response.getCreatedQuestionExpectedResponse(),
        numberOfTestCases: 0,
      });
    });
  });

  describe("Given a valid createQuestionBody with only the question", () => {
    it("should create a question without test cases and reference solution and return the created question", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        assignmentId,
        ...Request.getCreateQuestionRequestBody({
          includeTestCases: false,
          includeReferenceSolution: false,
        }),
      };

      dbMock.assignment.findUnique = jest.fn().mockResolvedValue({
        id: assignmentId,
      });
      dbMock.question.create = jest.fn().mockResolvedValue({
        ...Response.getCreatedQuestionDbResponse(false),
        numberOfTestCases: 0,
        referenceSolution: null,
      });
      dbMock.question.update = jest.fn().mockResolvedValue(null);
      dbMock.assignment.update = jest.fn().mockResolvedValue({
        numberOfQuestions: 1,
      });

      // Act
      const createdQuestion =
        await PostHandler.createQuestion(createQuestionBody);

      // Assert
      expect(dbMock.assignment.findUnique).toHaveBeenCalledTimes(1);
      expect(dbMock.question.create).toHaveBeenCalledTimes(1);
      expect(dbMock.question.update).toHaveBeenCalledTimes(0);
      expect(dbMock.assignment.update).toHaveBeenCalledTimes(1);
      expect(createdQuestion).toEqual({
        ...Response.getCreatedQuestionExpectedResponse(false),
        numberOfTestCases: 0,
        referenceSolutionId: undefined,
      });
    });
  });

  describe("Given a createQuestionBody with a non-existing assignmentId", () => {
    it("should return null", async () => {
      // Arrange
      const assignmentId = "non-existing-assignment-id";
      const createQuestionBody = {
        assignmentId,
        ...Request.getCreateQuestionRequestBody(),
      };

      dbMock.assignment.findUnique = jest.fn().mockResolvedValue(null);
      dbMock.question.create = jest.fn().mockResolvedValue(null);
      dbMock.question.update = jest.fn().mockResolvedValue(null);
      dbMock.assignment.update = jest.fn().mockResolvedValue(null);

      // Act
      const createdQuestion =
        await PostHandler.createQuestion(createQuestionBody);

      // Assert
      expect(dbMock.assignment.findUnique).toHaveBeenCalledTimes(1);
      expect(dbMock.question.create).toHaveBeenCalledTimes(0);
      expect(dbMock.question.update).toHaveBeenCalledTimes(0);
      expect(dbMock.assignment.update).toHaveBeenCalledTimes(0);
      expect(createdQuestion).toBeNull();
    });
  });

  describe("Given the database is down", () => {
    it("should throw an error", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        assignmentId,
        ...Request.getCreateQuestionRequestBody(),
      };
      dbMock.assignment.findUnique = jest
        .fn()
        .mockRejectedValue(new Error("Database is down"));

      // Act & Assert
      await expect(
        PostHandler.createQuestion(createQuestionBody)
      ).rejects.toThrow("Database is down");
    });
  });
});

describe("Unit Tests for POST /assignment/api/assignments/:id/questions", () => {
  const app = createUnitTestServer();

  describe("Given a valid createQuestionBody with question, test cases, and reference solution", () => {
    it("should create a question and return the created question", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = Request.getCreateQuestionRequestBody();
      const expectedResponse = Response.getCreatedQuestionExpectedResponse();

      const spy = jest
        .spyOn(PostHandler, "createQuestion")
        .mockResolvedValue(expectedResponse);

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(response.body).toEqual(expectedResponse);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a valid createQuestionBody with question and test cases but without reference solution", () => {
    it("should create a question without reference solution and return the created question", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = Request.getCreateQuestionRequestBody({
        includeReferenceSolution: false,
      });
      const expectedResponse =
        Response.getCreatedQuestionExpectedResponse(false);

      const spy = jest
        .spyOn(PostHandler, "createQuestion")
        .mockResolvedValue(expectedResponse);

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(response.body).toEqual(expectedResponse);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a valid createQuestionBody with question and reference solution but without test cases", () => {
    it("should create a question without test cases and return the created question", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = Request.getCreateQuestionRequestBody({
        includeTestCases: false,
      });
      const expectedResponse = {
        ...Response.getCreatedQuestionExpectedResponse(),
        numberOfTestCases: 0,
      };

      const spy = jest
        .spyOn(PostHandler, "createQuestion")
        .mockResolvedValue(expectedResponse);

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(response.body).toEqual(expectedResponse);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a valid createQuestionBody with only the question", () => {
    it("should create a question without test cases and reference solution and return the created question", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = Request.getCreateQuestionRequestBody({
        includeTestCases: false,
        includeReferenceSolution: false,
      });
      const expectedResponse = {
        ...Response.getCreatedQuestionExpectedResponse(false),
        numberOfTestCases: 0,
        referenceSolutionId: undefined,
      };

      const spy = jest
        .spyOn(PostHandler, "createQuestion")
        .mockResolvedValue(expectedResponse);

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(response.body).toEqual(expectedResponse);

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given a createQuestionBody with no question title", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        title: undefined,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Title is required.",
      });
    });
  });

  describe("Given a createQuestionBody with title equals empty string", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        title: "",
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid title. String must contain at least 1 character(s)",
      });
    });
  });

  describe("Given a createQuestionBody with title that is too long (>255 characters)", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        title: "a".repeat(256),
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid title. String must contain at most 255 character(s)",
      });
    });
  });

  describe("Given a createQuestionBody with deadline in the past", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        deadline: new Date("2020-12-31T23:59:59.999Z").getTime(),
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Deadline must be in the future",
      });
    });
  });

  describe("Given a createQuestionBody with negative deadline value", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        deadline: -1,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid deadline. Number must be greater than 0",
      });
    });
  });

  describe("Given a createQuestionBody with deadline to be floating point number", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        deadline: 1.5,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid deadline. Expected integer, received float",
      });
    });
  });

  describe("Given a createQuestionBody with empty description", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        description: "",
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message:
          "Invalid description. String must contain at least 1 character(s)",
      });
    });
  });

  describe("Given a createQuestionBody with description that is too long (>50000 characters)", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        description: "a".repeat(50001),
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message:
          "Invalid description. String must contain at most 50000 character(s)",
      });
    });
  });

  describe("Given a createQuestionBody with test cases that are not an array", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        testCases: "test-cases",
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid testCases. Expected array, received string",
      });
    });
  });

  describe("Given a createQuestionBody with test cases that are empty array", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        testCases: [],
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid testCases. Array must contain at least 1 element(s)",
      });
    });
  });

  describe("Given a createQuestionBody with test cases that contain an element that is not an object", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const testCases = ["test-case"];
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        testCases,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid testCases. Expected object, received string",
      });
    });
  });

  describe("Given a createQuestionBody with test cases that contain an element with missing input field", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const testCases = [
        {
          output: "output",
        },
      ];
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        testCases,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "TestCases input is required.",
      });
    });
  });

  describe("Given a createQuestionBody with test cases that contain input that are too long (>10000 characters)", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const testCases = [
        {
          input: "a".repeat(10001),
          output: "output",
        },
      ];
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        testCases,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message:
          "Invalid testCases. String must contain at most 10000 character(s)",
      });
    });
  });

  describe("Given a createQuestionBody with output that is not string", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const testCases = [
        {
          input: "input",
          output: 1,
        },
      ];
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        testCases,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid testCases. Expected string, received number",
      });
    });
  });

  describe("Given a createQuestionBody with reference solution that is not an object", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const referenceSolution = "reference-solution";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        referenceSolution,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid referenceSolution. Expected object, received string",
      });
    });
  });

  describe("Given a createQuestionBody with reference solution that contains missing language field", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const referenceSolution = {
        code: "code",
      };
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        referenceSolution,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "ReferenceSolution language is required.",
      });
    });
  });

  describe("Given a createQuestionBody with reference solution that contains too long code (>10000)", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const referenceSolution = {
        language: "c",
        code: "a".repeat(10001),
      };
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        referenceSolution,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message:
          "Invalid referenceSolution. String must contain at most 10000 character(s)",
      });
    });
  });

  describe("Given a createQuestionBody with reference solution that contains empty code", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const referenceSolution = {
        language: "c",
        code: "",
      };
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        referenceSolution,
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message:
          "Invalid referenceSolution. String must contain at least 1 character(s)",
      });
    });
  });

  describe("Given a createQuestionBody with a non-existing assignmentId", () => {
    it("should return 404 and an error message", async () => {
      // Arrange
      const assignmentId = "non-existing-assignment-id";
      const createQuestionBody = Request.getCreateQuestionRequestBody();

      const spy = jest
        .spyOn(PostHandler, "createQuestion")
        .mockResolvedValue(null);

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

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

  describe("Given an empty request body", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send({});

      // Assert
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "BAD REQUEST",
        message: "Request body is empty",
      });
    });
  });

  describe("Given a request body contains extra fields", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = {
        ...Request.getCreateQuestionRequestBody(),
        extraField: "extra-field",
      };

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

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
      const assignmentId = "existing-assigment-id";
      const createQuestionBody = Request.getCreateQuestionRequestBody();

      const spy = jest
        .spyOn(PostHandler, "createQuestion")
        .mockRejectedValue(new Error("Database is down"));

      // Act
      const response = await supertest(app)
        .post(`${API_PREFIX}/assignments/${assignmentId}/questions`)
        .send(createQuestionBody);

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
