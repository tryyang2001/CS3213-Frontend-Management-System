"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Spacer,
  Divider,
} from "@nextui-org/react";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import AssignmentQuestion from "../../../../../components/assignment/AssignmentQuestion";
import DateUtils from "../../../../../utils/dateUtils";
import AssignmentPage from "@/components/assignment/AssignmentPage";
import * as monaco from "monaco-editor";

// import AssignmentQuestion from "./../../../../../components/assignment/AssignmentQuestion";

interface Props {
  id: string;
  question: Question;
}

const Submission = ({ id, question }: Props) => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("python");

  const newDecoration: monaco.editor.IModelDeltaDecoration[] = [
    {
      range: new monaco.Range(2, 1, 2, 1), // Highlight row 2
      options: {
        isWholeLine: true,
        className: "bg-yellow-200",
      },
    },
  ];

  const onMount = (editor: any) => {
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
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-assignment", id],
    queryFn: async () => {
      const assignment = await AssignmentService.getAssignmentById({
        assignmentId: id,
      });

      return assignment;
    },
  });

  if (isError) {
    return notFound();
  }

  const feedback = {
    line: 2,
    hints: ["Incorrect else block for if ( ((x % 2) == 1) )"],
  };

  let tabs = [
    {
      id: "testcases",
      label: "Test Cases",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      id: "feedback",
      label: "Feedback",
      content: `Line ${feedback.line.toString()}: ${feedback.hints[0]}`,
    },
    {
      id: "grades",
      label: "Grades",
      content:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ];

  return (
    <div>
      {assignment && (
        <div className="h-screen">
          <h1>Submissions</h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <div className="flex gap-2">
                <div>
                  <h1 className="text-3xl font-semibold ">
                    {assignment.title}
                  </h1>
                  <div className="flex flex-col ml-4 my-4 gap-2">
                    <p className="text-lg font-semibold">
                      Due on:{" "}
                      <span className="italic font-medium">
                        {DateUtils.parseTimestampToDate(assignment.deadline)}
                      </span>
                    </p>
                    <p className="text-lg font-semibold">
                      Number of questions:{" "}
                      <span className="italic font-medium">
                        {assignment.numberOfQuestions}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex px-0 py-4 mb-6">
                <div className="w-full px-5">
                  {/* Question title */}
                  <div className="flex space-x-4">
                    <div className="flex-1 mr-2 text-xl font-semibold">
                      {/* {question.title} */}
                    </div>
                  </div>

                  <Divider className="mt-4 mb-2" />

                  {/* Question description */}
                  <div className="flex mt-3">
                    <div className="text-md text-justify">
                      {/* {parse(question.description)} */}
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
                  height="50vh"
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
                  <Tabs aria-label="Dynamic tabs" items={tabs}>
                    {(item) => (
                      <Tab key={item.id} title={item.label}>
                        <Card>
                          <CardBody>{item.content}</CardBody>
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
};

export default Submission;

{
  /*}
<div className="col-span-1">
        <div className="flex gap-2">
          <div>
            <h1 className="text-3xl font-semibold ">{assignment.title}</h1>
            <div className="flex flex-col ml-4 my-4 gap-2">
              <p className="text-lg font-semibold">
                Due on:{" "}
                <span className="italic font-medium">
                  {DateUtils.parseTimestampToDate(assignment.deadline)}
                </span>
              </p>
              <p className="text-lg font-semibold">
                Number of questions:{" "}
                <span className="italic font-medium">
                  {assignment.numberOfQuestions}
                </span>
              </p>
            </div>
          </div>
        </div>

      {assignment.questions.map((question) => {
        return <AssignmentQuestion question={question} key={question.id} />;
      })}
    </div>
        </div>


    */
}
