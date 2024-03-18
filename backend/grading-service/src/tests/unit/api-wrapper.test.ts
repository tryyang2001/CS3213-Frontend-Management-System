import StudentSolution from "../payloads/student-code";
import { ITSApi, api } from "../../services/its/api-wrapper";
import ITSPostParserError from "../../libs/errors/ITSPostParserError";
import { AxiosError } from "axios";
import db from "../../models/db";
import ReferenceSolution from "../payloads/reference-code";

const NODE_ENV = "test";

const axiosMock = api as jest.Mocked<typeof api>;

describe("Unit tests for generateParser service", () => {
  describe("Given a valid language and source_code", () => {
    it("should return the parser result of the source_code", async () => {
      // Arrange
      const language = StudentSolution.language;
      const sourceCode = StudentSolution.sourceCode;
      axiosMock.post = jest.fn().mockResolvedValue({
        data: StudentSolution.codeParser,
      });

      // Act
      const parserString = JSON.parse(
        await ITSApi.generateParserString(language, sourceCode)
      );

      // Assert
      expect(parserString).toBe(StudentSolution.codeParser);

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
      const sourceCode = StudentSolution.sourceCode;

      // reject with AxiosError
      axiosMock.post = jest.fn().mockImplementation(() => {
        throw new AxiosError();
      });

      // Act & Assert
      try {
        await ITSApi.generateParserString(language, sourceCode);
      } catch (e) {
        console.log(e);
        expect(e).toBeInstanceOf(ITSPostParserError);
      }
    });
  });
});

describe("Unit tests for generateFeedback service", () => {
  const dbMock = db as jest.Mocked<typeof db>;

  describe("Given correct inputs with submitted code having errors", () => {
    // Arrange
    // set up the mock
    const language = "python";
    const studentCode = StudentSolution.sourceCode;
    const questionId = "existing-question-id";
    const studentId = 1;

    beforeEach(() => {
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
          .mockResolvedValue(StudentSolution.codeParser);

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
        expect(feedbacks[0].lineNumber).toBe(2);
        expect(feedbacks[0].hintStrings).toContain(
          "Incorrect else-block for if ( ((x % 2) == 1) )"
        );

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
          .mockResolvedValueOnce(StudentSolution.codeParser);

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
        expect(feedbacks[0].lineNumber).toBe(2);
        expect(feedbacks[0].hintStrings).toContain(
          "Incorrect else-block for if ( ((x % 2) == 1) )"
        );

        // reset the mock
        spy.mockRestore();
        jest.clearAllMocks();
      });
    });
  });
});
