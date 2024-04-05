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

const getAssignmentsByUserId = async (userId: string) => {
  try {
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

const createAssignment = async (requestBody: CreateAssignmentBody) => {
  try {
    const response = await api.post("/assignments", requestBody);

    const createdAssignment = response.data as Assignment;

    return createdAssignment;
  } catch (_error) {
    throw new Error("Failed to create assignment");
  }
};

const createQuestion = async (requestBody: CreateQuestionBody) => {
  try {
    const response = await api.post("/questions", requestBody);

    const createdQuestion = response.data as Question;

    return createdQuestion;
  } catch (_error) {
    throw new Error("Failed to create question");
  }
};

const createQuestions = async (requestBody: CreateQuestionBody[]) => {
  try {
    const questionPromises = requestBody.map((question) =>
      createQuestion(question)
    );

    const createdQuestions = await Promise.all(questionPromises);

    return createdQuestions;
  } catch (_error) {
    throw new Error("Failed to create questions");
  }
};

const assignmentService = {
  getAssignmentById,
  getAssignmentsByUserId,
  createAssignment,
  createQuestion,
  createQuestions,
};

export default assignmentService;
