"use client";

import { Input, Link, Switch } from "@nextui-org/react";
import { useState } from "react";

interface Props {
  testCases: TestCase[];
  setTestCases: (testCases: TestCase[]) => void;
}

function TestCasesInput({ testCases, setTestCases }: Props) {
  const [showAll, setShowAll] = useState(false);
  const visibleTestCases = showAll ? testCases : testCases.slice(0, 5);

  return (
    <div className="mt-2">
      {/* only show the first 5 test cases, hide the rest if longer than 5 */}
      {visibleTestCases.map((testCase, index) => {
        return (
          <div className="flex gap-2 my-1" key={index}>
            <Input
              label={`Input for Test Case ${index + 1}`}
              value={testCase.input}
              onValueChange={(value) => {
                setTestCases(
                  testCases.map((tc, i) => {
                    if (i === index) {
                      tc.input = value;
                    }
                    return tc;
                  })
                );
              }}
              className="w-[40%]"
            />
            <Input
              className="w-[40%]"
              label={`Output for Test Case ${index + 1}`}
              value={testCase.output}
              onValueChange={(value) => {
                setTestCases(
                  testCases.map((tc, i) => {
                    if (i === index) {
                      tc.output = value;
                    }
                    return tc;
                  })
                );
              }}
            />
            <Switch
              isSelected={testCase.isPublic ?? true}
              onValueChange={(selection) => {
                setTestCases(
                  testCases.map((tc, i) => {
                    if (i === index) {
                      tc.isPublic = selection;
                    }
                    return tc;
                  })
                );
              }}
              color="primary"
            >
              {testCase.isPublic === undefined || testCase.isPublic
                ? "Public"
                : "Private"}
            </Switch>
          </div>
        );
      })}

      {/* show a button to toggle visibility of all test cases */}
      {testCases.length > 5 && (
        <div className="flex justify-center">
          <Link href="#" onClick={() => setShowAll(!showAll)} color="secondary">
            {showAll ? "Hide" : "Show all"}
          </Link>
        </div>
      )}
    </div>
  );
}

export default TestCasesInput;
