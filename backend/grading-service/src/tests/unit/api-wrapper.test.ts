import StudentSolution from "../payloads/student-code";
import { ITSApi, api } from "../../services/its/api-wrapper";
import ITSPostParserError from "../../libs/errors/ITSPostParserError";
import { AxiosError } from "axios";
import db from "../../models/db";
import ReferenceSolution from "../payloads/reference-code";
import NotExistingReferencedSolutionError from "../../libs/errors/NotExistingReferencedSolutionError";
import CodeFunctionNameError from "../../libs/errors/CodeFunctionNameError";
import NotExistingTestCaseError from "../../libs/errors/NotExistingTestCaseError";
import ITSPostFeedbackError from "../../libs/errors/ITSPostFeedbackError";
import HttpStatusCode from "../../libs/enums/HttpStatusCode";
import CodeError from "../payloads/code-error";
import NotExistingStudentError from "../../libs/errors/NotExistingStudentError";

const NODE_ENV = "test";

const axiosMock = api as jest.Mocked<typeof api>;

describe("Unit tests for generateParser service", () => {
  describe("Given a valid language and source_code", () => {
    it("should return the parser result of the source_code", async () => {
      // Arrange
      const language = StudentSolution.language;
      const sourceCode = StudentSolution.pySourceCode;
      axiosMock.post = jest.fn().mockResolvedValue({
        data: StudentSolution.pyCodeParser,
      });

      // Act
      const parserString = JSON.parse(
        await ITSApi.generateParserString(language, sourceCode)
      );

      // Assert
      expect(parserString).toBe(StudentSolution.pyCodeParser);

      const parser = JSON.parse(parserString);

      expect(parser).toHaveProperty("importStatements");
      expect(parser).toHaveProperty("fncs");
      expect(parser["fncs"]).toHaveProperty(StudentSolution.targetFunction);
      expect(parser["fncs"][StudentSolution.targetFunction].name).toBe(
        StudentSolution.targetFunction
      );
    });
  });

  describe("Given ITS API returns an error code due to invalid language type", () => {
    it("should throw an ITSPostParserError", async () => {
      // Arrange
      const language = "non-supported-language";
      const sourceCode = StudentSolution.pySourceCode;

      // reject with AxiosError
      axiosMock.post = jest.fn().mockImplementation(() => {
        throw {
          response: {
            status: HttpStatusCode.UNPROCESSABLE_ENTITY,
          },
          isAxiosError: true,
        } as AxiosError;
      });

      // Act & Assert
      try {
        await ITSApi.generateParserString(language, sourceCode);
      } catch (error) {
        expect(error).toBeInstanceOf(ITSPostParserError);
        expect((error as ITSPostParserError).message).toBe(
          "Failed to generate parser string from ITS API"
        );
        expect((error as ITSPostParserError).errorField).toBe("language");
      }
    });
  });

  describe("Given ITS API returns an error code due to invalid source_code", () => {
    it("should throw an ITSPostParserError", async () => {
      // Arrange
      const language = StudentSolution.language;
      const sourceCode = "def : { error }";

      // reject with AxiosError
      axiosMock.post = jest.fn().mockImplementation(() => {
        throw {
          response: {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          },
          isAxiosError: true,
        } as AxiosError;
      });

      // Act & Assert
      try {
        await ITSApi.generateParserString(language, sourceCode);
      } catch (error) {
        expect(error).toBeInstanceOf(ITSPostParserError);
        expect((error as ITSPostParserError).message).toBe(
          "Failed to generate parser string from ITS API"
        );
        expect((error as ITSPostParserError).errorField).toBe("source_code");
      }
    });
  });

  describe("Given ITS API returns an invalid parser due to whatever reason", () => {
    it("should throw an Error", async () => {
      // Arrange
      const language = StudentSolution.language;
      const sourceCode = StudentSolution.pySourceCode;

      // reject with AxiosError
      axiosMock.post = jest.fn().mockResolvedValue({});

      // Act & Assert
      try {
        await ITSApi.generateParserString(language, sourceCode);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});

describe("Unit tests for generateFeedback service", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given correct inputs with submitted python code having errors", () => {
    // Arrange
    const { language, studentCode, questionId, studentId } =
      setupMockedGenerateErrorFeedbackParams();

    beforeEach(() => {
      dbMock.user.findUnique = jest.fn().mockResolvedValue({
        id: studentId,
      });

      dbMock.testCase.findFirst = jest.fn().mockResolvedValue({
        input: "2",
        output: "False",
      });

      axiosMock.post = jest.fn().mockImplementation((url, data) => {
        if (url.includes("feedback_error")) {
          return Promise.resolve({
            data: [
              {
                lineNumber: 2,
                hintStrings: ["Incorrect else-block for if ( ((x % 2) == 1) )"],
              },
            ],
          });
        }
      });

      // prevent writing to database
      dbMock.submission.findFirst = jest.fn().mockResolvedValue(null);
      dbMock.submission.create = jest.fn().mockResolvedValue({
        id: "submission-id",
      });
      dbMock.feedback.createMany = jest.fn().mockResolvedValue(null);
    });

    describe("Given the reference solution parser string exists in the database", () => {
      it("should generate the feedback with the error location", async () => {
        // Arrange
        dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue({
          codeParser: ReferenceSolution.codeParser,
        });
        const spy = jest
          .spyOn(ITSApi, "generateParserString")
          .mockResolvedValue(StudentSolution.pyCodeParser);

        // Act
        const feedbacks = await ITSApi.generateErrorFeedback(
          language,
          studentCode,
          questionId,
          studentId
        );

        // Assert
        expect(axiosMock.post).toHaveBeenCalledTimes(1);
        expect(dbMock.referenceSolution.findFirst).toHaveBeenCalledTimes(1);
        expect(dbMock.testCase.findFirst).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findFirst).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.create).toHaveBeenCalledTimes(1);
        expect(dbMock.feedback.createMany).toHaveBeenCalledTimes(1);
        expect(feedbacks).toHaveLength(1);
        expect(feedbacks[0].line).toBe(2);
        expect(feedbacks[0].hints).toContain(CodeError.hintStrings[0]);

        // reset the mock
        spy.mockRestore();
        jest.clearAllMocks();
      });
    });

    describe("Given the reference solution parser string does not exist in the database", () => {
      it("should generate the feedback with the error location", async () => {
        // Arrange
        dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue({
          codeParser: null,
          code: ReferenceSolution.sourceCode,
          language: "python",
        });
        dbMock.referenceSolution.update = jest.fn().mockResolvedValue(null);
        const spy = jest
          .spyOn(ITSApi, "generateParserString")
          .mockResolvedValueOnce(ReferenceSolution.codeParser)
          .mockResolvedValueOnce(StudentSolution.pyCodeParser);

        // Act
        const feedbacks = await ITSApi.generateErrorFeedback(
          language,
          studentCode,
          questionId,
          studentId
        );

        // Assert
        expect(axiosMock.post).toHaveBeenCalledTimes(1);
        expect(dbMock.referenceSolution.findFirst).toHaveBeenCalledTimes(1);
        expect(dbMock.referenceSolution.update).toHaveBeenCalledTimes(1);
        expect(dbMock.testCase.findFirst).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findFirst).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.create).toHaveBeenCalledTimes(1);
        expect(dbMock.feedback.createMany).toHaveBeenCalledTimes(1);
        expect(feedbacks).toHaveLength(1);
        expect(feedbacks[0].line).toBe(2);
        expect(feedbacks[0].hints).toContain(
          "Incorrect else-block for if ( ((x % 2) == 1) )"
        );

        // reset the mock
        spy.mockRestore();
        jest.clearAllMocks();
      });
    });

    describe("Given the submission already exists in the database", () => {
      it("should replace the existing submission with the new one", async () => {
        // Arrange
        dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue({
          codeParser: ReferenceSolution.codeParser,
        });
        const spy = jest
          .spyOn(ITSApi, "generateParserString")
          .mockResolvedValue(StudentSolution.pyCodeParser);

        dbMock.submission.findFirst = jest.fn().mockResolvedValue({
          id: "submission-id",
        });
        dbMock.submission.delete = jest.fn().mockResolvedValue(null);
        dbMock.submission.create = jest.fn().mockResolvedValue({
          id: "new-submission-id",
        });
        dbMock.feedback.createMany = jest.fn().mockResolvedValue(null);

        // Act
        const feedbacks = await ITSApi.generateErrorFeedback(
          language,
          studentCode,
          questionId,
          studentId
        );

        // Assert
        expect(axiosMock.post).toHaveBeenCalledTimes(1);
        expect(dbMock.referenceSolution.findFirst).toHaveBeenCalledTimes(1);
        expect(dbMock.testCase.findFirst).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.findFirst).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.delete).toHaveBeenCalledTimes(1);
        expect(dbMock.submission.create).toHaveBeenCalledTimes(1);
        expect(dbMock.feedback.createMany).toHaveBeenCalledTimes(1);
        expect(feedbacks).toHaveLength(1);
        expect(feedbacks[0].line).toBe(2);
        expect(feedbacks[0].hints).toContain(
          "Incorrect else-block for if ( ((x % 2) == 1) )"
        );

        // reset the mock
        spy.mockRestore();
        jest.clearAllMocks();
      });
    });
  });

  describe("Given correct inputs with submitted C code that has no error", () => {
    it("should return an empty array of feedbacks", async () => {
      // Arange
      const { language, studentCode, questionId, studentId } =
        setupMockedGenerateErrorFeedbackParams({
          desiredLanguage: "c",
        });

      dbMock.user.findUnique = jest.fn().mockResolvedValue({
        id: studentId,
      });

      dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue({
        codeParser: StudentSolution.cCodeParser,
      });
      const spy = jest
        .spyOn(ITSApi, "generateParserString")
        .mockResolvedValue(StudentSolution.cCodeParser);

      dbMock.testCase.findFirst = jest.fn().mockResolvedValue({
        input: "2",
        output: "0",
      });

      axiosMock.post = jest.fn().mockResolvedValue({
        data: [],
      });

      // prevent writing to database
      dbMock.submission.findFirst = jest.fn().mockResolvedValue(null);
      dbMock.submission.create = jest.fn().mockResolvedValue({
        id: "submission-id",
      });
      dbMock.feedback.createMany = jest.fn().mockResolvedValue(null);

      // Act
      const feedbacks = await ITSApi.generateErrorFeedback(
        language,
        studentCode,
        questionId,
        studentId
      );

      // Assert
      expect(dbMock.referenceSolution.findFirst).toHaveBeenCalledTimes(1);
      expect(dbMock.testCase.findFirst).toHaveBeenCalledTimes(1);
      expect(ITSApi.generateParserString).toHaveBeenCalledTimes(1);
      expect(axiosMock.post).toHaveBeenCalledTimes(1);
      expect(feedbacks).toHaveLength(0);

      // reset the mock
      spy.mockRestore();
    });
  });

  describe("Given there is no reference solution for the question", () => {
    it("should throw a NotExistingReferencedSolutionError", async () => {
      // Arrange
      const language = "python";
      const studentCode = StudentSolution.pySourceCode;
      const questionId = "existing-question-id";
      const studentId = 1;

      dbMock.user.findUnique = jest.fn().mockResolvedValue({
        id: studentId,
      });

      dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue(null);

      // Act & Assert
      try {
        await ITSApi.generateErrorFeedback(
          language,
          studentCode,
          questionId,
          studentId
        );
      } catch (error) {
        expect(error instanceof NotExistingReferencedSolutionError).toBe(true);
        expect((error as NotExistingReferencedSolutionError).message).toBe(
          "Referenced solution does not exist"
        );
      }
    });
  });

  describe("Given the student code does not have the target function", () => {
    it("should throw a CodeFunctionNameError", async () => {
      // Arrange
      const { language, studentCode, questionId, studentId } =
        setupMockedGenerateErrorFeedbackParams({
          withoutTargetFunction: true,
        });

      dbMock.user.findUnique = jest.fn().mockResolvedValue({
        id: studentId,
      });

      dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue({
        codeParser: ReferenceSolution.codeParser,
      });
      const spy = jest
        .spyOn(ITSApi, "generateParserString")
        .mockResolvedValue(StudentSolution.pyCodeParserWithoutTargetFunction);

      // Act & Assert
      try {
        await ITSApi.generateErrorFeedback(
          language,
          studentCode,
          questionId,
          studentId
        );
      } catch (error) {
        console.log(error);
        expect(error instanceof CodeFunctionNameError).toBe(true);
        expect((error as CodeFunctionNameError).message).toBe(
          'Solution code does not contain the target function "is_odd" declaration'
        );
      }

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("Given there is no test case for the question", () => {
    it("should throw a NotExistingTestCaseError", async () => {
      // Arrange
      const { language, studentCode, questionId, studentId } =
        setupMockedGenerateErrorFeedbackParams();

      dbMock.user.findUnique = jest.fn().mockResolvedValue({
        id: studentId,
      });

      dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue({
        codeParser: ReferenceSolution.codeParser,
      });

      const spy = jest
        .spyOn(ITSApi, "generateParserString")
        .mockResolvedValue(StudentSolution.pyCodeParser);

      dbMock.testCase.findFirst = jest.fn().mockResolvedValue(null);

      // Act & Assert
      try {
        await ITSApi.generateErrorFeedback(
          language,
          studentCode,
          questionId,
          studentId
        );
      } catch (error) {
        expect(error instanceof NotExistingTestCaseError).toBe(true);
        expect((error as NotExistingTestCaseError).message).toBe(
          "Test case does not exist"
        );
      }
    });
  });

  describe("Given a non-existing student id", () => {
    it("should throw a NotExistingStudentError", async () => {
      // Arrange
      const { language, studentCode, questionId, studentId } =
        setupMockedGenerateErrorFeedbackParams({ studentExists: false });

      dbMock.user.findUnique = jest.fn().mockResolvedValue(null);

      // Act & Assert
      try {
        await ITSApi.generateErrorFeedback(
          language,
          studentCode,
          questionId,
          studentId
        );
      } catch (error) {
        expect(error instanceof NotExistingStudentError).toBe(true);
        expect((error as NotExistingStudentError).message).toBe(
          `Student with id ${studentId} does not exist`
        );
      }
    });
  });

  describe("Given the ITS API returns an error", () => {
    it("should throw an ITSPostFeedbackError", async () => {
      // Arrange
      const { language, studentCode, questionId, studentId } =
        setupMockedGenerateErrorFeedbackParams();

      dbMock.user.findUnique = jest.fn().mockResolvedValue({
        id: studentId,
      });

      dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue({
        codeParser: ReferenceSolution.codeParser,
      });

      const spy = jest
        .spyOn(ITSApi, "generateParserString")
        .mockResolvedValue(StudentSolution.pyCodeParser);

      dbMock.testCase.findFirst = jest.fn().mockResolvedValue({
        input: "2",
        output: "False",
      });

      axiosMock.post = jest.fn().mockImplementation((url, _) => {
        if (url.includes("feedback_error")) {
          throw new AxiosError();
        }
      });

      // Act & Assert
      try {
        await ITSApi.generateErrorFeedback(
          language,
          studentCode,
          questionId,
          studentId
        );
      } catch (error) {
        expect(error instanceof ITSPostFeedbackError).toBe(true);
        expect((error as ITSPostFeedbackError).message).toBe(
          "Failed to generate feedback from ITS API"
        );
      }

      // reset the mocks
      spy.mockRestore();
    });
  });

  describe("GIven the ITS API returns an invalid/non-array data due to whatever reason", () => {
    it("should throw an Error", async () => {
      // Arrange
      const { language, studentCode, questionId, studentId } =
        setupMockedGenerateErrorFeedbackParams();

      dbMock.user.findUnique = jest.fn().mockResolvedValue({
        id: studentId,
      });

      dbMock.referenceSolution.findFirst = jest.fn().mockResolvedValue({
        codeParser: ReferenceSolution.codeParser,
      });

      const spy = jest
        .spyOn(ITSApi, "generateParserString")
        .mockResolvedValue(StudentSolution.pyCodeParser);

      dbMock.testCase.findFirst = jest.fn().mockResolvedValue({
        input: "2",
        output: "False",
      });

      axiosMock.post = jest.fn().mockResolvedValue({
        data: "invalid-data",
      });

      // Act & Assert
      try {
        await ITSApi.generateErrorFeedback(
          language,
          studentCode,
          questionId,
          studentId
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      // reset the mocks
      spy.mockRestore();
    });
  });
});

// Helper function for setting up necessary mocks
function setupMockedGenerateErrorFeedbackParams(
  {
    isValidLanguage,
    desiredLanguage,
    questionExists,
    studentExists,
    withoutTargetFunction,
  }: {
    isValidLanguage?: boolean;
    desiredLanguage?: string;
    questionExists?: boolean;
    studentExists?: boolean;
    withoutTargetFunction?: boolean;
  } = {
    isValidLanguage: true,
    desiredLanguage: "python",
    questionExists: true,
    studentExists: true,
    withoutTargetFunction: false,
  }
) {
  let language: string;
  let studentCode: string;

  if (isValidLanguage) {
    language = desiredLanguage ?? "python";
  } else {
    language = "non-supported-language";
  }

  switch (language) {
    case "python" || "py":
      studentCode = withoutTargetFunction
        ? StudentSolution.pySourceCodeWithoutTargetFunction
        : StudentSolution.pySourceCode;
      break;
    case "c":
      studentCode = StudentSolution.cSourceCode;
      break;
    default:
      studentCode = "";
  }

  const questionId = questionExists
    ? "existing-question-id"
    : "non-existing-question-id";
  const studentId = studentExists ? 1 : -1;

  return { language, studentCode, questionId, studentId };
}
