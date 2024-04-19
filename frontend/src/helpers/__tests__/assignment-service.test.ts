import {
  mockAssignment,
  mockReferenceSolution,
  mockTestCases,
} from "@/utils/testUtils";
import assignmentService from "../assignment-service/api-wrapper";
import MockAdaptor from "axios-mock-adapter";

describe("Assignment Service API tests", () => {
  const mock = new MockAdaptor(assignmentService.api);
  beforeEach(() => {
    mock.reset();
  });

  describe("getAssignmentById", () => {
    const subapi = "/assignments/";
    describe("given wrong parameters", () => {
      test("throws error on bad request", async () => {
        mock.onGet(subapi + "2").abortRequest();
        const response = async () =>
          await assignmentService.getAssignmentById("2");
        await expect(response()).rejects.toThrow(Error);
      });
      test("returns null on not found", async () => {
        const response = await assignmentService.getAssignmentById("2");
        expect(response).toBeNull();
      });
    });

    describe("given existing id", () => {
      test("returns assignments correctly", async () => {
        mock.onGet("/assignments/1").reply(200, mockAssignment);
        const response = await assignmentService.getAssignmentById("1");
        expect(response).toStrictEqual(mockAssignment);
      });
    });
  });

  describe("getAssignmentByUserId", () => {
    const subapi = "/assignments?userId=";
    describe("given wrong parameters", () => {
      test("throws an error on api error", async () => {
        mock.onGet(subapi + "2" + "&&").abortRequest();
        const response = async () =>
          await assignmentService.getAssignmentsByUserId("2");
        await expect(response).rejects.toThrow(Error);
      });
      test("returns empty on not found", async () => {
        mock.onGet(subapi + "2" + "&&").reply(404);
        const response = await assignmentService.getAssignmentsByUserId("2");
        expect(response).toStrictEqual([]);
      });
    });
    describe("given correct parameters", () => {
      test("returns assignment", async () => {
        mock.onGet(subapi + "1" + "&&").reply(200, [mockAssignment]);
        mock
          .onGet(subapi + "1" + "&includePast=true&")
          .reply(200, [mockAssignment]);
        mock
          .onGet(subapi + "1" + "&includePast=true&isPublished=true")
          .reply(200, [mockAssignment, mockAssignment]);
        const response1 = await assignmentService.getAssignmentsByUserId("1");
        const response2 = await assignmentService.getAssignmentsByUserId(
          "1",
          true
        );
        const response3 = await assignmentService.getAssignmentsByUserId(
          "1",
          true,
          true
        );

        expect(response1).toStrictEqual([mockAssignment]);
        expect(response2).toStrictEqual([mockAssignment]);
        expect(response3).toStrictEqual([mockAssignment, mockAssignment]);
      });
    });
  });

  describe("getQuestionReferenceSolution", () => {
    const subapi = (str: string) => `/questions/${str}/solution`;
    describe("given wrong parameters", () => {
      test("throws error on bad request", async () => {
        mock.onGet(subapi("2")).abortRequest();
        await expect(
          assignmentService.getQuestionReferenceSolution("2")
        ).rejects.toThrow(Error);
      });
      test("returns undefine on not found", async () => {
        mock.onGet(subapi("2")).reply(404);
        const response =
          await assignmentService.getQuestionReferenceSolution("2");
        expect(response).toBeUndefined();
      });
    });
    describe("given correct parameters", () => {
      test("returns reference solution", async () => {
        mock.onGet(subapi("1")).reply(200, mockReferenceSolution);
        const response =
          await assignmentService.getQuestionReferenceSolution("1");
        expect(response).toStrictEqual(mockReferenceSolution);
      });
    });
  });

  describe("getQuestionTestCases", () => {
    const subapi = (str: string) => `/questions/${str}/test-cases`;
    describe("given wrong parameters", () => {
      test("throws error on bad request", async () => {
        mock.onGet(subapi("2")).abortRequest();
        await expect(
          assignmentService.getQuestionTestCases("2")
        ).rejects.toThrow(Error);
      });
      test("returns empty array on not found", async () => {
        mock.onGet(subapi("2")).reply(404);
        const response = await assignmentService.getQuestionTestCases("2");
        expect(response).toStrictEqual([]);
      });
    });
    describe("given correct parameters", () => {
      test("returns test cases", async () => {
        mock.onGet(subapi("1")).reply(200, mockTestCases);
        const response = await assignmentService.getQuestionTestCases("1");
        expect(response).toStrictEqual(mockTestCases);
      });
    });
  });

  describe("createAssignment", () => {
    const subapi = "/assignments";
    const mockCreation = { title: "good", deadline: 9999 };

    describe("given wrong parameters", () => {
      test("throws error", async () => {
        mock.onPost(subapi).abortRequest();
        await expect(
          assignmentService.createAssignment(mockCreation)
        ).rejects.toThrow(Error);
      });
    });
    describe("given correct parameters", () => {
      test("returns created assignment", async () => {
        mock.onPost(subapi).reply(200, mockAssignment);
        const response = await assignmentService.createAssignment(mockCreation);
        expect(response).toStrictEqual(mockAssignment);
      });
    });
  });
  describe("updateAssignment", () => {
    const subapi = (str: string) => `/assignments/${str}`;
    const mockUpdate = {
      title: "string",
      deadline: 1,
    };
    describe("given wrong parameters", () => {
      test("throws error", async () => {
        mock.onPut(subapi("2")).abortRequest();
        await expect(
          assignmentService.updateAssignment("2", mockUpdate)
        ).rejects.toThrow(Error);
      });
    });
    describe("given correct parameters", () => {
      test("returns created assignment", async () => {
        mock.onPut(subapi("1")).reply(200, mockAssignment);
        const response = await assignmentService.updateAssignment(
          "1",
          mockUpdate
        );
        expect(response).toStrictEqual(mockAssignment);
      });
    });
  });
  describe("createQuestion", () => {
    const subapi = (str: string) => `/assignments/${str}/questions`;
    const mockCreate = {
      title: "string",
      description: "string",
    };
    describe("given wrong parameters", () => {
      test("throws error", async () => {
        mock.onPost(subapi("2")).abortRequest();
        await expect(
          assignmentService.createQuestion("2", mockCreate)
        ).rejects.toThrow(Error);
      });
    });
    describe("given correct parameters", () => {
      test("returns created assignment", async () => {
        mock.onPost(subapi("1")).reply(200, mockAssignment);
        const response = await assignmentService.createQuestion(
          "1",
          mockCreate
        );
        expect(response).toStrictEqual(mockAssignment);
      });
    });
  });
  describe("createQuestions", () => {
    const subapi = (str: string) => `/assignments/${str}/questions`;
    const mockCreates = [
      {
        title: "string",
        description: "string",
      },
      {
        title: "2",
        description: "3",
      },
    ];
    describe("given wrong parameters", () => {
      test("throws error", async () => {
        mock.onPost(subapi("2")).abortRequest();
        await expect(
          assignmentService.createQuestions("2", mockCreates)
        ).rejects.toThrow(Error);
      });
    });
    describe("given correct parameters", () => {
      test("returns created assignment", async () => {
        mock.onPost(subapi("1")).reply(200, mockAssignment);
        const response = await assignmentService.createQuestions(
          "1",
          mockCreates
        );
        expect(response).toStrictEqual([mockAssignment, mockAssignment]);
      });
    });
  });
});
