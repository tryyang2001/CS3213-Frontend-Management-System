"use client";

import Icons from "@/components/common/Icons";
import { Button, Input, Link, Switch, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface Props {
  testCases: TestCase[];
  setTestCases: (testCases: TestCase[]) => void;
}

function TestCasesInput({ testCases, setTestCases }: Props) {
  const [showAll, setShowAll] = useState(false);

  let visibleTestCases = showAll ? testCases : testCases.slice(0, 5);

  if (visibleTestCases.length === 0) {
    visibleTestCases = [{ input: "", output: "", isPublic: true }];
  }

  const [testCaseUniqueIds, setTestCaseUniqueIds] = useState<string[]>(() => {
    if (testCases.length === 0) {
      return [crypto.randomUUID()];
    }

    return testCases.map((tc) => tc.id ?? crypto.randomUUID());
  });

  return (
    <div className="mt-2" key="who">
      {/* only show the first 5 test cases, hide the rest if longer than 5 */}
      {visibleTestCases.map((testCase, index) => {
        return (
          <div
            className="flex gap-2 my-1 justify-center items-center"
            key={testCaseUniqueIds[index]}
          >
            <Input
              label={`Input for Test Case ${index + 1}`}
              value={testCase.input}
              onValueChange={(value) => {
                setTestCases(
                  visibleTestCases.map((tc, i) => {
                    if (i === index) {
                      tc.input = value;
                    }
                    return tc;
                  })
                );
              }}
              size="sm"
              className="w-[40%]"
            />
            <Input
              label={`Output for Test Case ${index + 1}`}
              value={testCase.output}
              onValueChange={(value) => {
                setTestCases(
                  visibleTestCases.map((tc, i) => {
                    if (i === index) {
                      tc.output = value;
                    }
                    return tc;
                  })
                );
              }}
              size="sm"
              className="w-[40%]"
            />

            <div className="mx-4">
              <Switch
                isSelected={testCase.isPublic ?? true}
                onValueChange={(selection) => {
                  setTestCases(
                    visibleTestCases.map((tc, i) => {
                      if (i === index) {
                        tc.isPublic = selection;
                      }
                      return tc;
                    })
                  );
                }}
                color="primary"
                size="sm"
              >
                <span className="w-[40px] inline-block">
                  {testCase.isPublic === undefined || testCase.isPublic
                    ? "Public "
                    : "Private"}
                </span>
              </Switch>
            </div>

            {/* A delete button */}
            <Tooltip content="Delete current test case">
              <Button
                isIconOnly
                isDisabled={testCases.length <= 1}
                className="bg-danger flex items-center justify-center"
                onClick={() => {
                  setTestCaseUniqueIds(
                    testCaseUniqueIds.filter((_, i) => i !== index)
                  );
                  setTestCases(testCases.filter((_, i) => i !== index));
                }}
                size="sm"
              >
                <Icons.Delete className="text-white" />
              </Button>
            </Tooltip>

            {index === visibleTestCases.length - 1 ? (
              <Tooltip content="Add new test cases">
                <Button
                  onClick={() => {
                    setShowAll(true);
                    setTestCaseUniqueIds([
                      ...testCaseUniqueIds,
                      crypto.randomUUID(),
                    ]);
                    setTestCases([
                      ...testCases,
                      { input: "", output: "", isPublic: true },
                    ]);
                  }}
                  size="sm"
                  isIconOnly
                  variant="bordered"
                  className="bg-white ml-auto text-xl"
                >
                  <Icons.Add />
                </Button>
              </Tooltip>
            ) : (
              <Button
                isIconOnly
                variant="bordered"
                size="sm"
                className="invisible"
              >
                <Icons.Add />
              </Button>
            )}
          </div>
        );
      })}

      {/* show a button to toggle visibility of all test cases */}
      {testCases.length > 5 && (
        <div className="flex justify-center mt-4">
          <Button
            as={Link}
            href="#"
            onClick={() => setShowAll(!showAll)}
            color="secondary"
          >
            {showAll ? "Hide" : `Show all (${testCases.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}

export default TestCasesInput;
