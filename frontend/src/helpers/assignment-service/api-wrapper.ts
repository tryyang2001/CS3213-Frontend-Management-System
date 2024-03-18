//import HttpStatusCode from "@/types/HttpStatusCode";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/assignment/api",
  timeout: 5000,
  headers: {
    "Content-type": "application/json",
  },
});

const getAssignmentById = async ({
  assignmentId,
}: {
  assignmentId: string;
}) => {
  const _response = await api
    .get(`/assignment/${assignmentId}`)
    .catch((err: Error) => console.log(err));

  //   if (response.status !== HttpStatusCode.OK) {
  //     throw new Error("Failed to fetch assignment");
  //   }

  //   const assignment: Assignment = response.data;

  const assignment: Assignment = {
    id: assignmentId,
    title: "Assignment 1: Introduction to programming",
    deadline: 1711900799999,
    isPublished: true,
    numberOfQuestions: 2,
    questions: [
      {
        id: "1",
        title: "Question 1: Two Sum",
        description: `
          <p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
          <p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>
          <p>You can return the answer in any order.</p>
          <p>&nbsp;</p>
          <p><strong class="example">Example 1:</strong></p>
          <pre><strong>Input:</strong> nums = [2,7,11,15], target = 9
          <strong>Output:</strong> [0,1]
          <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
          </pre>
          <p><strong class="example">Example 2:</strong></p>
          <pre><strong>Input:</strong> nums = [3,2,4], target = 6
          <strong>Output:</strong> [1,2]
          </pre>
          <p>&nbsp;</p>
          <p><strong>Constraints:</strong></p>
          <ul>
            <li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
            <li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
            <li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
            <li><strong>Only one valid answer exists.</strong></li>
          </ul>
          <p>&nbsp;</p>
          <strong>Follow-up:&nbsp;</strong>
          Can you come up with an algorithm that is less than <code>O(n<sup>2</sup>)</code> time complexity?
        `,
        numberOfTestCases: 1,
        testCases: [
          {
            input: "1",
            output: "1",
            isPublic: true,
          },
        ],
        referenceSolutionId: "referenceSolutionId",
      },
      {
        id: "2",
        title: "Question 2",
        description: "This is another question",
        numberOfTestCases: 1,
        testCases: [
          {
            input: "1",
            output: "1",
            isPublic: true,
          },
        ],
        referenceSolutionId: "referenceSolutionId",
      },
    ],
    authors: ["1"],
    createdOn: Date.now(),
    updatedOn: Date.now(),
  };

  return assignment;
};

const assignmentService = {
  getAssignmentById,
};

export default assignmentService;