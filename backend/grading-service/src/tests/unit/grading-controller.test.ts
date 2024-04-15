import supertest from "supertest";
import createUnitTestServer from "../utils/create-test-server-utils";
import StudentSolution from "../payloads/student-code";
import { ITSApi } from "../../services/its/api-wrapper";
import HttpStatusCode from "../../libs/enums/HttpStatusCode";
import ITSPostParserError from "../../libs/errors/ITSPostParserError";
import CodeError from "../payloads/code-error";
import CodeFunctionNameError from "../../libs/errors/CodeFunctionNameError";
import NotExistingReferencedSolutionError from "../../libs/errors/NotExistingReferencedSolutionError";
import NotExistingTestCaseError from "../../libs/errors/NotExistingTestCaseError";
import NotExistingStudentError from "../../libs/errors/NotExistingStudentError";
import ITSPostFeedbackError from "../../libs/errors/ITSPostFeedbackError";
import { GetHandler } from "../../services/get-handler";
import { Submission } from "../../types/grading-service";

const app = createUnitTestServer();
const API_PREFIX = "/grading/api";

describe("Unit Tests for Grading Controller", () => {
  describe("Unit Tests for postParser", () => {
    describe("Given a valid language and source code in the request body", () => {
      it("should return 200 with a parser string", async () => {
        // Arrange
        const language = "py";
        const source_code = StudentSolution.pySourceCode;
        const expectedParserString = StudentSolution.pyCodeParser;

        const spy = jest
          .spyOn(ITSApi, "generateParserString")
          .mockResolvedValue(expectedParserString);

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/parser/generate`)
          .send({ language, source_code });

        // Assert
        expect(response.status).toBe(HttpStatusCode.OK);
        expect(Object.keys(response.body).length).toBe(1);
        expect(response.body).toHaveProperty("parser");
        expect(response.body).toEqual({
          parser: expectedParserString,
        });

        // reset the mocks
        spy.mockRestore();
      });
    });

    describe("Given a non-supported language in the request body", () => {
      it("should return 400 with an error message", async () => {
        // Arrange
        const language = "non-supported-language";
        const source_code = StudentSolution.pySourceCode;

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/parser/generate`)
          .send({ language, source_code });

        // Assert
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "BAD REQUEST",
          message: "Language not supported. (Only 'py' and 'c' are supported)",
        });
      });
    });

    describe("Given an empty source code in the request body", () => {
      it("should return 400 with an error message", async () => {
        // Arrange
        const language = "py";
        const source_code = "";

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/parser/generate`)
          .send({ language, source_code });

        // Assert
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "BAD REQUEST",
          message:
            "Invalid source_code. String must contain at least 1 character(s)",
        });
      });
    });

    describe("Given an invalid source code in the request body that causes an error in ITS API", () => {
      it("should return 400 with an error message", async () => {
        // Arrange
        const language = "py";
        const source_code = "def invalid: {error}";

        const spy = jest
          .spyOn(ITSApi, "generateParserString")
          .mockRejectedValue(new ITSPostParserError("source_code"));

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/parser/generate`)
          .send({ language, source_code });

        // Assert
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "BAD REQUEST",
          message:
            "Invalid source_code. Failed to generate parser string from ITS API",
        });

        // reset the mocks
        spy.mockRestore();
      });
    });
  });

  describe("Unit Test for postFeedback", () => {
    describe("Given a valid language, source_code, question_id, and student_id in the request body", () => {
      describe("Assume that the source_code contains an error", () => {
        it("should return 200 with an error feedback", async () => {
          // Arrange
          const language = "py";
          const source_code = StudentSolution.pySourceCode;
          const question_id = "existing-question-id";
          const student_id = 1;

          const spy = jest
            .spyOn(ITSApi, "generateErrorFeedback")
            .mockResolvedValue(CodeError.errorFeedbacks);

          // Act
          const response = await supertest(app)
            .post(`${API_PREFIX}/feedback/generate`)
            .send({ language, source_code, question_id, student_id });

          // Assert
          expect(response.status).toBe(HttpStatusCode.OK);
          expect(Object.keys(response.body).length).toBe(2);
          expect(response.body).toHaveProperty("hasError");
          expect(response.body.hasError).toBe(true);
          expect(response.body).toHaveProperty("feedbacks");
          expect(response.body.feedbacks).toEqual(CodeError.errorFeedbacks);

          // reset the mocks
          spy.mockRestore();
        });
      });

      describe("Assume that the source_code has no error", () => {
        it("should return 200 with no error feedback", async () => {
          // Arrange
          const language = "py";
          const source_code = StudentSolution.pySourceCode;
          const question_id = "existing-question-id";
          const student_id = 1;

          const spy = jest
            .spyOn(ITSApi, "generateErrorFeedback")
            .mockResolvedValue([]);

          // Act
          const response = await supertest(app)
            .post(`${API_PREFIX}/feedback/generate`)
            .send({ language, source_code, question_id, student_id });

          // Assert
          expect(response.status).toBe(HttpStatusCode.OK);
          expect(Object.keys(response.body).length).toBe(2);
          expect(response.body).toHaveProperty("hasError");
          expect(response.body.hasError).toBe(false);
          expect(response.body).toHaveProperty("feedbacks");
          expect(response.body.feedbacks).toEqual([]);

          // reset the mocks
          spy.mockRestore();
        });
      });
    });
    describe("Given a non-supported language in the request body", () => {
      it("should return 400 with an error message", async () => {
        // Arrange
        const language = "non-supported-language";
        const source_code = StudentSolution.pySourceCode;
        const question_id = "existing-question-id";
        const student_id = 1;

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/feedback/generate`)
          .send({ language, source_code, question_id, student_id });

        // Assert
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "BAD REQUEST",
          message: "Language not supported. (Only 'py' and 'c' are supported)",
        });
      });
    });

    describe("Given an empty source code in the request body", () => {
      it("should return 400 with an error message", async () => {
        // Arrange
        const language = "py";
        const source_code = "";
        const question_id = "existing-question-id";
        const student_id = 1;

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/feedback/generate`)
          .send({ language, source_code, question_id, student_id });

        // Assert
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "BAD REQUEST",
          message:
            "Invalid source_code. String must contain at least 1 character(s)",
        });
      });
    });

    describe("Given an invalid source code in the request body that causes an error in ITS API", () => {
      it("should return 400 with an error message", async () => {
        // Arrange
        const language = "py";
        const source_code = "def invalid: {error}";
        const question_id = "existing-question-id";
        const student_id = 1;

        const spy = jest
          .spyOn(ITSApi, "generateErrorFeedback")
          .mockRejectedValue(new ITSPostParserError("source_code"));

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/feedback/generate`)
          .send({ language, source_code, question_id, student_id });

        // Assert
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "BAD REQUEST",
          message:
            "Invalid source_code. Failed to generate parser string from ITS API",
        });

        // reset the mocks
        spy.mockRestore();
      });
    });

    describe("Given the source code does not include the target function", () => {
      it("should return 400 with an error message", async () => {
        // Arrange
        const language = "py";
        const source_code = StudentSolution.pySourceCodeWithoutTargetFunction;
        const question_id = "existing-question-id";
        const student_id = 1;

        const spy = jest
          .spyOn(ITSApi, "generateErrorFeedback")
          .mockRejectedValue(new CodeFunctionNameError("is_odd"));

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/feedback/generate`)
          .send({ language, source_code, question_id, student_id });

        // Assert
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "BAD REQUEST",
          message:
            'Invalid source_code. Solution code does not contain the target function "is_odd" declaration',
        });

        // reset the mocks
        spy.mockRestore();
      });
    });

    describe("Given the question id has no reference solution", () => {
      it("should return 404 with an error message", async () => {
        // Arrange
        const language = "py";
        const source_code = StudentSolution.pySourceCode;
        const question_id = "existing-question-id";
        const student_id = 1;

        const spy = jest
          .spyOn(ITSApi, "generateErrorFeedback")
          .mockRejectedValue(new NotExistingReferencedSolutionError());

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/feedback/generate`)
          .send({ language, source_code, question_id, student_id });

        // Assert
        expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "NOT FOUND",
          message: "Invalid question_id. Referenced solution does not exist",
        });

        // reset the mocks
        spy.mockRestore();
      });
    });

    describe("Given the question id has no test case", () => {
      it("should return 404 with an error message", async () => {
        // Arrange
        const language = "py";
        const source_code = StudentSolution.pySourceCode;
        const question_id = "existing-question-id";
        const student_id = 1;

        const spy = jest
          .spyOn(ITSApi, "generateErrorFeedback")
          .mockRejectedValue(new NotExistingTestCaseError());

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/feedback/generate`)
          .send({ language, source_code, question_id, student_id });

        // Assert
        expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "NOT FOUND",
          message: "Invalid question_id. Test case does not exist",
        });

        // reset the mocks
        spy.mockRestore();
      });
    });

    describe("Given a non-existing student id", () => {
      it("should return 404 with an error message", async () => {
        // Arrange
        const language = "py";
        const source_code = StudentSolution.pySourceCode;
        const question_id = "existing-question-id";
        const student_id = 999;

        const spy = jest
          .spyOn(ITSApi, "generateErrorFeedback")
          .mockRejectedValue(new NotExistingStudentError(student_id));

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/feedback/generate`)
          .send({ language, source_code, question_id, student_id });

        // Assert
        expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "NOT FOUND",
          message: `Invalid student_id. Student with id ${student_id} does not exist`,
        });

        // reset the mocks
        spy.mockRestore();
      });
    });

    describe("Given ITS API returns unexpected errors when generating error feedback", () => {
      it("should return 400 with an error message", async () => {
        // Arrange
        const language = "py";
        const source_code = StudentSolution.pySourceCode;
        const question_id = "existing-question-id";
        const student_id = 1;

        const spy = jest
          .spyOn(ITSApi, "generateErrorFeedback")
          .mockRejectedValue(new ITSPostFeedbackError());

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/feedback/generate`)
          .send({ language, source_code, question_id, student_id });

        // Assert
        expect(response.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "UNPROCESSABLE ENTITY",
          message: "Invalid request. Failed to generate feedback from ITS API",
        });

        // reset the mocks
        spy.mockRestore();
      });
    });

    describe("Given the database is down", () => {
      it("should return 500 with an error message", async () => {
        // Arrange
        const language = "py";
        const source_code = StudentSolution.pySourceCode;
        const question_id = "existing-question-id";
        const student_id = 1;

        const spy = jest
          .spyOn(ITSApi, "generateErrorFeedback")
          .mockRejectedValue(new Error("Database is down"));

        // Act
        const response = await supertest(app)
          .post(`${API_PREFIX}/feedback/generate`)
          .send({ language, source_code, question_id, student_id });

        // Assert
        expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "INTERNAL SERVER ERROR",
          message: "An unexpected error has occurred. Please try again later",
        });

        // reset the mocks
        spy.mockRestore();
      });
    });
  });

  describe("Unit Test for getSubmissionsByQuestionIdAndStudentId", () => {
    describe("Given an existing question id and student id", () => {
      it("should return 200 with the submission", async () => {
        // Arrange
        const questionId = "existing-question-id";
        const studentId = "1";

        const spy = jest
          .spyOn(GetHandler, "getSubmissionsByQuestionIdAndStudentId")
          .mockResolvedValue([
            {
              ...StudentSolution.submissions[0],
              createdOn: new Date("2024-04-08T00:00:00Z").getTime(),
            },
          ]);

        // Act
        const response = await supertest(app)
          .get(`${API_PREFIX}/questions/${questionId}/submissions/`)
          .query({ studentId: studentId });

        // Assert
        expect(response.status).toBe(HttpStatusCode.OK);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body as Array<Submission>).toHaveLength(1);

        const firstSubmission = (response.body as Array<Submission>)[0];

        expect(Object.keys(firstSubmission).length).toBe(7);
        expect(firstSubmission).toHaveProperty("id");
        expect(firstSubmission).toHaveProperty("questionId");
        expect(firstSubmission).toHaveProperty("studentId");
        expect(firstSubmission).toHaveProperty("language");
        expect(firstSubmission).toHaveProperty("code");
        expect(firstSubmission).toHaveProperty("feedbacks");
        expect(firstSubmission).toEqual({
          ...StudentSolution.submissions[0],
          createdOn: new Date("2024-04-08T00:00:00Z").getTime(),
        });

        // reset the mocks
        spy.mockRestore();
      });
    });

    describe("Given there is no submission for the question id and student id", () => {
      it("should return 404 with an error message", async () => {
        // Arrange
        const questionId = "non-existing-question-id";
        const studentId = "999";

        const spy = jest
          .spyOn(GetHandler, "getSubmissionsByQuestionIdAndStudentId")
          .mockRejectedValue(new NotExistingStudentError(999));

        // Act
        const response = await supertest(app)
          .get(`${API_PREFIX}/questions/${questionId}/submissions/`)
          .query({ studentId: studentId });

        // Assert
        expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "NOT FOUND",
          message: `Invalid student_id. Student with id ${studentId} does not exist`,
        });

        // reset the mocks
        spy.mockRestore();
      });
    });

    describe("Given the student id is missing in the query", () => {
      it("should return 400 with an error message", async () => {
        // Arrange
        const questionId = "existing-question-id";

        // Act
        const response = await supertest(app).get(
          `${API_PREFIX}/questions/${questionId}/submissions/`
        );

        // Assert
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "BAD REQUEST",
          message: "StudentId is required.",
        });
      });
    });

    describe("Given the database is down", () => {
      it("should return 500 with an error message", async () => {
        // Arrange
        const questionId = "existing-question-id";
        const studentId = "1";

        const spy = jest
          .spyOn(GetHandler, "getSubmissionsByQuestionIdAndStudentId")
          .mockRejectedValue(new Error("Database is down"));

        // Act
        const response = await supertest(app)
          .get(`${API_PREFIX}/questions/${questionId}/submissions/`)
          .query({ studentId: studentId });

        // Assert
        expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "INTERNAL SERVER ERROR",
          message: "An unexpected error has occurred. Please try again later",
        });

        // reset the mocks
        spy.mockRestore();
      });
    });
  });
});
