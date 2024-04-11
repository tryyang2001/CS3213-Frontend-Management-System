import HttpStatusCode from "@/types/HttpStatusCode";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL:
    process.env.ASSIGNMENT_API_URL ?? "http://localhost:8080/assignment/api",
  timeout: 5000,
  headers: {
    "Content-type": "application/json",
  },
});

interface GetAssignmentsResponse {
  assignments: Assignment[];
}

const getAssignmentById = async (assignmentId: string) => {
  try {
    const response = await api.get(`/assignments/${assignmentId}`);

    const assignment = response.data as Assignment;

    // sort questions by createdOn date
    assignment.questions?.sort((a, b) => a.createdOn - b.createdOn);

    return assignment;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch ((error as AxiosError).response?.status) {
        case HttpStatusCode.NOT_FOUND:
          return null;
        default:
          throw new Error("Failed to fetch assignment");
      }
    }

    throw new Error("Failed to fetch assignment");
  }
};

const getAssignmentsByUserId = async (userId: number | string) => {
  try {
    // default user id is 0, which means no user is logged in
    if (userId === 0) {
      return [];
    }

    const response = await api.get<GetAssignmentsResponse>(
      `/assignments?userId=${userId}`
    );

    const assignments = response.data.assignments;

    return assignments;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch ((error as AxiosError).response?.status) {
        case HttpStatusCode.NOT_FOUND:
          return [];
        default:
          throw new Error("Failed to fetch assignment");
      }
    }

    throw new Error("Failed to fetch assignment");
  }
};

const getQuestionReferenceSolution = async (questionId: string) => {
  try {
    const response = await api.get(`/questions/${questionId}/solution`);

    const referenceSolution = response.data as ReferenceSolution;

    return referenceSolution;
  } catch (_error) {
    if (
      axios.isAxiosError(_error) &&
      _error.response?.status === HttpStatusCode.NOT_FOUND
    ) {
      return undefined;
    }

    throw new Error("Failed to fetch reference solution");
  }
};

const getQuestionTestCases = async (questionId: string) => {
  try {
    const response = await api.get(`/questions/${questionId}/test-cases`);

    const testCases = response.data as TestCase[];

    return testCases;
  } catch (_error) {
    if (
      axios.isAxiosError(_error) &&
      _error.response?.status === HttpStatusCode.NOT_FOUND
    ) {
      return [];
    }

    throw new Error("Failed to fetch test cases");
  }
};

const createAssignment = async (requestBody: CreateAssignmentBody) => {
  try {
    if (requestBody.deadline instanceof Date) {
      // cast Date to timestamp
      requestBody.deadline = requestBody.deadline.getTime();
    }

    if (requestBody.isPublished === undefined) {
      // default to not publishing the assignment
      requestBody.isPublished = false;
    }

    const response = await api.post("/assignments", requestBody);

    const createdAssignment = response.data as Assignment;

    return createdAssignment;
  } catch (_error) {
    throw new Error("Failed to create assignment");
  }
};

const updateAssignment = async (
  assignmentId: string,
  requestBody: CreateAssignmentBody
) => {
  try {
    if (requestBody.deadline instanceof Date) {
      // cast Date to timestamp
      requestBody.deadline = requestBody.deadline.getTime();
    }

    const response = await api.put(`/assignments/${assignmentId}`, requestBody);

    const updatedAssignment = response.data as Assignment;

    return updatedAssignment;
  } catch (_error) {
    throw new Error("Failed to update assignment");
  }
};

const createQuestion = async (
  assignmentId: string,
  requestBody: CreateQuestionBody
) => {
  try {
    const response = await api.post(
      `/assignments/${assignmentId}/questions`,
      requestBody
    );

    const createdQuestion = response.data as Question;

    return createdQuestion;
  } catch (_error) {
    throw new Error("Failed to create question");
  }
};

const createQuestions = async (
  assignmentId: string,
  requestBody: CreateQuestionBody[]
) => {
  try {
    const questionPromises = requestBody.map((question) =>
      createQuestion(assignmentId, question)
    );

    const createdQuestions = await Promise.all(questionPromises);

    return createdQuestions;
  } catch (_error) {
    throw new Error("Failed to create questions");
  }
};

const updateQuestion = async (
  questionId: string,
  requestBody: CreateQuestionBody
) => {
  try {
    if (requestBody.deadline instanceof Date) {
      // cast Date to timestamp
      requestBody.deadline = requestBody.deadline.getTime();
    }

    if (requestBody.referenceSolution) {
      // update reference solution
      await api.put(`/questions/${questionId}/solution`, {
        language: requestBody.referenceSolution.language,
        code: requestBody.referenceSolution.code,
      });
    }

    if (requestBody.testCases && requestBody.testCases.length > 0) {
      const existingTestCases = await getQuestionTestCases(questionId);
      const existingTestCaseIds = existingTestCases.map(
        (testCase) => testCase.id!
      );

      // delete all existing test cases, and re-create them
      await deleteTestCases(questionId, existingTestCaseIds);

      // create new test cases
      await api.post(`/questions/${questionId}/test-cases`, {
        testCases: requestBody.testCases,
      });
    }

    const response = await api.put(`/questions/${questionId}`, {
      ...requestBody,
      referenceSolution: undefined,
      testCases: undefined,
    });

    const updatedQuestion = response.data as Question;

    return updatedQuestion;
  } catch (_error) {
    throw new Error("Failed to update question");
  }
};

const deleteAssignment = async (assignmentId: string) => {
  try {
    await api.delete(`/assignments/${assignmentId}`);
  } catch (_error) {
    throw new Error("Failed to delete assignment");
  }
};

const deleteQuestion = async (questionId: string) => {
  try {
    await api.delete(`/questions/${questionId}`);
  } catch (_error) {
    throw new Error("Failed to delete question");
  }
};

const deleteTestCases = async (questionId: string, testCaseIds: string[]) => {
  try {
    if (testCaseIds.length === 0) {
      return;
    }

    await api.delete(`/questions/${questionId}/test-cases`, {
      data: { testCaseIds },
    });
  } catch (_error) {
    throw new Error("Failed to delete test cases");
  }
};

const AssignmentService = {
  getAssignmentById,
  getAssignmentsByUserId,
  getQuestionReferenceSolution,
  getQuestionTestCases,
  createAssignment,
  createQuestion,
  createQuestions,
  updateAssignment,
  updateQuestion,
  deleteAssignment,
  deleteQuestion,
};

export default AssignmentService;
