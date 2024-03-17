import StudentCode, { StudentCodeParser } from "../payloads/student-code";
import { ITSApi, api } from "../../services/its/api-wrapper";
import ITSPostParserError from "../../libs/errors/ITSPostParserError";
import HttpStatusCode from "../../libs/enums/HttpStatusCode";
import { AxiosError } from "axios";

const NODE_ENV = "test";

const axiosMock = api as jest.Mocked<typeof api>;

describe("Unit tests for generateParser service", () => {
  describe("Given a valid language and source_code", () => {
    it("should return the parser result of the source_code", async () => {
      // Arrange
      const language = StudentCode.language;
      const sourceCode = StudentCode.sourceCode;
      axiosMock.post = jest.fn().mockResolvedValue({
        data: StudentCodeParser.parser,
      });

      // Act
      const parserString = JSON.parse(
        await ITSApi.generateParserString(language, sourceCode)
      );

      // Assert
      expect(parserString).toBe(StudentCodeParser.parser);

      const parser = JSON.parse(parserString);

      expect(parser).toHaveProperty("importStatements");
      expect(parser).toHaveProperty("fncs");
      expect(parser["fncs"]).toHaveProperty(StudentCode.targetFunction);
      expect(parser["fncs"][StudentCode.targetFunction].name).toBe(
        StudentCode.targetFunction
      );
    });
  });

  describe("Given ITS API returns an error code due to invalid language type", () => {
    it("should throw an ITSPostParserError", async () => {
      // Arrange
      const language = "non-supported-language";
      const sourceCode = StudentCode.sourceCode;

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
  describe("Given xxx", () => {
    it("should xxx", async () => {});
  });
});
