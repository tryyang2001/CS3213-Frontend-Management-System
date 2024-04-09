import HttpStatusCode from "@/types/HttpStatusCode";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.GRADING_API_URL ?? "http://localhost:8080/grading/api",
  timeout: 10000,
  headers: {
    "Content-type": "application/json",
  },
});

const getSubmissionByQuestionIdAndStudentId = async ({
  questionId,
  studentId,
}: {
  questionId: string;
  studentId: number;
}) => {
  try {
    const response = await api.get(
      `/questions/${questionId}/submissions?studentId=${studentId}`
    );

    let submissions: Submission[] = response.data;

    submissions.sort((a, b) => b.createdOn - a.createdOn);

    return submissions;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch ((error as AxiosError).response?.status) {
        case HttpStatusCode.NOT_FOUND:
          return [];
        default:
          throw new Error("Failed to fetch submissions");
      }
    }

    throw new Error("Failed to fetch submissions");
  }
};

const GradingService = {
  getSubmissionByQuestionIdAndStudentId,
};

export default GradingService;
