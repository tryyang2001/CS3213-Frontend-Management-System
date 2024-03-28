import HttpStatusCode from "@/types/HttpStatusCode";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL:
    process.env.ASSIGNMENT_API_URL || "http://localhost:8080/assignment/api",
  timeout: 5000,
  headers: {
    "Content-type": "application/json",
  },
});

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
    const response = await api.get(`/assignments?userId=${userId}`);

    const assignments = response.data.assignments as Assignment[];

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
    if (requestBody.deadline instanceof Date) {
      // cast Date to timestamp
      requestBody.deadline = requestBody.deadline.getTime();
    }

    if (requestBody.authors === undefined) {
      // TODO: create user context, and get the id from there
      requestBody.authors = ["rui_yang_tan_user_id_1"];
    }

    if (requestBody.isPublished === undefined) {
      // default to not publishing the assignment
      requestBody.isPublished = false;
    }

    const response = await api.post("/assignments", requestBody);

    const createdAssignment = response.data as Assignment;

    return createdAssignment;
  } catch (error) {
    throw new Error("Failed to create assignment");
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
  } catch (error) {
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
  } catch (error) {
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
