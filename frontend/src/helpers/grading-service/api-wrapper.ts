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
  studentId: string;
}) => {
  try {
    const response = await api.get(
      `/questions/${questionId}/submissions?studentId=${studentId}`
    );

    const submission = response.data as Submission;

    // const submission: Submission = {
    //   id: "clu270b2o000110wo9e73xxja",
    //   questionId: "cltu7sh7b0007rdzclqfnzbt9",
    //   studentId: 1,
    //   code: `def is_odd(x):
    //     if x % 2 == 1:
    //         return False
    //     else:
    //         return True`,
    //   language: "python",
    //   codeParser: `{"importStatements":[],"fncs":{"is_odd":{"name":"is_odd","rettype":"*","initloc":1,"endloc":0,"params":[{"val0":"x","val1":"*","valueArray":["x","*"],"valueList":["x","*"]}],"locexprs":{"1":[{"val0":"$ret","val1":{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},"valueArray":["$ret",{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2}],"valueList":["$ret",{"name":"ite","args":[{"name":"Eq","args":[{"name":"Mod","args":[{"name":"x","primed":false,"line":2,"tokentype":"Variable"},{"value":"2","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"1","line":2,"tokentype":"Constant"}],"line":2,"tokentype":"Operation"},{"value":"False","line":3,"tokentype":"Constant"},{"value":"True","line":5,"tokentype":"Constant"}],"line":2}]}]},"loctrans":{"1":{}},"locdescs":{"1":"around the beginning of function 'is_odd'"},"types":{}}}}`,
    //   createdOn: Date.now(),
    // };

    return submission;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch ((error as AxiosError).response?.status) {
        case HttpStatusCode.NOT_FOUND:
          return null;
        default:
          throw new Error("Failed to fetch submission");
      }
    }

    throw new Error("Failed to fetch submission");
  }
};

const GradingService = {
  getSubmissionByQuestionIdAndStudentId,
};

export default GradingService;
