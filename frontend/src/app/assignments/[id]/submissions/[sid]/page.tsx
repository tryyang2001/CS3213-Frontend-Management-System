"use client";

import { MutableRefObject, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Spacer,
  Divider,
  Code,
} from "@nextui-org/react";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import DateUtils from "../../../../../utils/dateUtils";
import * as monaco from "monaco-editor";

interface Props {
  params: {
    id: string;
    sid: string;
  };
}

interface Item {
  id: string;
  label: string;
  content: string[];
}

export default function SubmissionPage({ params }: Props) {
  const editorRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null> =
    useRef(null);
  // const [value, setValue] = useState("");
  // const [language, setLanguage] = useState("python");

  const feedback = {
    line: 2,
    hints: ["Incorrect else block for if ( ((x % 2) == 1) )"],
  };

  const newDecoration: monaco.editor.IModelDeltaDecoration[] = [
    {
      range: new monaco.Range(feedback.line, 1, feedback.line, 1), // Highlight row 2
      options: {
        isWholeLine: true,
        className: "bg-yellow-200",
      },
    },
  ];

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.createDecorationsCollection(newDecoration);
    editor.focus();
  };

  const code = `def is_odd(x):
  if x % 2 == 1:
    return False
  else:
    return True
  `;

  const {
    data: assignment,
    // isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-assignment", params.id],
    queryFn: () => {
      const assignment = AssignmentService.getAssignmentById({
        assignmentId: params.id,
      });

      return assignment;
    },
  });

  if (isError) {
    return notFound();
  }

  const tabs = [
    {
      id: "testcases",
      label: "Test Cases",
      content: [
        "is_odd(1)",
        "is_odd(2)",
        "is_odd(3)",
        "is_odd(0)",
        "is_odd(-1)",
      ],
    },
    {
      id: "feedback",
      label: "Feedback",
      content: [`Line ${feedback.line.toString()}: ${feedback.hints[0]}`],
    },
    {
      id: "grades",
      label: "Grades",
      content: [
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      ],
    },
  ];

  const renderTabContent = (tabId: string, item: Item) => {
    if (tabId === "testcases") {
      return (
        <div className="flex flex-col gap-4">
          {item.content.map((testcase: string) => (
            <Code color="default" key={testcase}>
              {testcase}
            </Code>
          ))}
        </div>
      );
    } else if (tabId === "feedback") {
      return item.content[0];
    } else if (tabId === "grades") {
      return item.content[0];
    }
  };

  return (
    <div>
      {assignment && (
        <div className="h-screen flex">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 overflow-auto flex-1 max-w-1/2">
              <div className="flex gap-2">
                <div>
                  <h1 className="text-3xl font-semibold ">
                    {assignment.title}
                  </h1>
                  <div className="flex flex-col my-4 gap-2">
                    <p className="text-lg font-semibold">
                      Due on:{" "}
                      <span className="italic font-medium">
                        {DateUtils.parseTimestampToDate(assignment.deadline)}
                      </span>
                    </p>
                    {/* <p className="text-lg font-semibold">
                      Number of questions:{" "}
                      <span className="italic font-medium">
                        {assignment.numberOfQuestions}
                      </span>
                    </p> */}
                  </div>
                </div>
              </div>
              <div className="flex px-0 py-4 mb-6">
                <div className="w-full">
                  {/* Question title */}
                  <div className="flex space-x-4">
                    <div className="flex-1 mr-2 text-xl font-semibold">
                      Question 1: Two Sum
                    </div>
                  </div>
                  <Divider className="mt-4 mb-2" />
                  Given an array of integers nums and an integer target, return
                  indices of the two numbers such that they add up to target.
                  You may assume that each input would have exactly one
                  solution, and you may not use the same element twice. You can
                  return the answer in any order.
                  <div className="flex mt-3 w-full">
                    <div className="text-md text-justify">
                      <b>Example 1:</b>
                      <Card
                        shadow="none"
                        radius="none"
                        className="bg-gray-100"
                        fullWidth={true}
                      >
                        <CardBody>nums = [2,7,11,15], target = 9</CardBody>
                      </Card>
                      <Spacer y={3} />
                      <Card
                        shadow="none"
                        radius="none"
                        className="bg-gray-100"
                        fullWidth={true}
                      >
                        <CardBody>Output: [0,1]</CardBody>
                      </Card>
                      <Spacer y={3} />
                      <span>
                        <b>Explanation: </b>
                        <p>Because nums[0] + nums[1] == 9, we return [0, 1].</p>
                      </span>
                      <Spacer y={6} />
                      <b>Example 2:</b>
                      <Card
                        shadow="none"
                        radius="none"
                        className="bg-gray-100"
                        fullWidth={true}
                      >
                        <CardBody>Input: nums = [3,2,4], target = 6</CardBody>
                      </Card>
                      <Spacer y={3} />
                      <Card
                        shadow="none"
                        radius="none"
                        className="bg-gray-100"
                        fullWidth={true}
                      >
                        <CardBody>Output: [1,2]</CardBody>
                      </Card>
                      <Spacer y={6} />
                      <b>Constraints:</b>
                      <p>{"2 <= nums.length <= 104"}</p>
                      <p>{"-109 <= nums[i] <= 109"}</p>
                      <p>{"-109 <= target <= 109"}</p>
                      <b>Only one valid answer exists.</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="row-span-1 border border-black">
                <Editor
                  options={{
                    minimap: {
                      enabled: false,
                    },
                    readOnly: true,
                  }}
                  height="55vh"
                  // theme="vs-dark"
                  language="python"
                  // defaultValue={CODE_SNIPPETS[language]}
                  onMount={onMount}
                  value={code}
                  // onChange={(value) => setValue(value)}
                />
              </div>
              <Spacer y={4} />
              <div className="row-span-1">
                <div className="flex w-full flex-col">
                  <Tabs color="primary" aria-label="Dynamic tabs" items={tabs}>
                    {(item) => (
                      <Tab key={item.id} title={item.label}>
                        <Card style={{ height: "30%" }}>
                          <CardBody>{renderTabContent(item.id, item)}</CardBody>
                        </Card>
                      </Tab>
                    )}
                  </Tabs>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
