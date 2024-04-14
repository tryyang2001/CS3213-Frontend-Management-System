import HttpStatusCode from "@/types/HttpStatusCode";
import axios, { AxiosError } from "axios";
import { GRADING_API_URL } from "@/config";

const api = axios.create({
  baseURL: GRADING_API_URL,
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

    const submissions = response.data as Submission[];

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

const postFeedback = async (requestBody: PostFeedbackBody) => {
  try {
    const response = await api.post("/feedback/generate", requestBody);

    const postedFeedback = response.data as Feedback;

    return postedFeedback;
  } catch (_error) {
    throw new Error("Failed to post feedback");
  }
};

const GradingService = {
  getSubmissionByQuestionIdAndStudentId,
  postFeedback,
};

export default GradingService;
