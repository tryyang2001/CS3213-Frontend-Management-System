"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { Tabs, Tab, Card, CardBody, CardHeader, Spacer } from "@nextui-org/react";
// import AssignmentQuestion from "./../../../../../components/assignment/AssignmentQuestion";

interface Props {
  id: string,
  question: Question;
}

const Submission = ({ id, question }: Props) => {
  const handleEditorDidMount = (
    editor: {
      onDidChangeModelContent: (arg0: (event: any) => void) => void;
      focus: () => void;
    },
    monaco: any
  ) => {
    editor.onDidChangeModelContent((event) => {});

    editor.focus();
  };

  const code = `define hello():
    print('Hello, world!');
  `;

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
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      id: "grades",
      label: "Grades",
      content:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ];

  return (
    <div className="h-screen">
      <h1>Submission Page</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">Assignment Question</div>
        <div className="col-span-1">
          <div className="row-span-1 border border-black">
            <Editor
              height="50vh"
              value={code}
              defaultLanguage="python"
              defaultValue="// some comment"
              onMount={handleEditorDidMount}
              options={{
                readOnly: true,
              }}
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
  );
};

export default Submission;
