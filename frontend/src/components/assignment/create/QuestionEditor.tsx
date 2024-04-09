"use client";

import { Checkbox, Input, Radio, RadioGroup, Tooltip } from "@nextui-org/react";
import FieldLabel from "./FieldLabel";
import { useEffect, useMemo, useState } from "react";
import DescriptionField from "./DescriptionField";
import DateUtils from "@/utils/dateUtils";
import FileUpload from "@/components/common/FileUpload";
import { Editor } from "@monaco-editor/react";
import TestCasesInput from "./TestCasesInput";
import Icons from "@/components/common/Icons";

interface Props {
  assignmentDeadline: number;
  initialQuestion: CreateQuestionBody;
  onQuestionChange: (updatedQuestion: CreateQuestionBody) => void;
}

function QuestionEditor({
  assignmentDeadline,
  initialQuestion,
  onQuestionChange,
}: Props) {
  // states declaration
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isAssignmentDeadline, setIsAssignmentDeadline] = useState(true);
  const [deadline, setDeadline] = useState(assignmentDeadline);

  const [language, setLanguage] = useState("python"); // default language is python
  const [referenceSolutionCode, setReferenceSolutionCode] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const [isTitleInvalid, setIsTitleInvalid] = useState(false);
  const [isDescriptionInvalid, setIsDescriptionInvalid] = useState(false);
  const [isDeadlineInvalid, setIsDeadlineInvalid] = useState(false);

  const editorHeight = useMemo(() => {
    const offset = 1;
    const lineWidth = 19;
    const lines = referenceSolutionCode.split("\n").length + offset;
    return `${lines * lineWidth}px`;
  }, [referenceSolutionCode]);

  useEffect(() => {
    setTitle(initialQuestion.title);
    setDescription(initialQuestion.description);
    setDeadline((initialQuestion.deadline as number) ?? assignmentDeadline);
    setLanguage(initialQuestion.referenceSolution?.language ?? "python");
    setReferenceSolutionCode(initialQuestion.referenceSolution?.code ?? "");
    setTestCases(initialQuestion.testCases ?? []);
  }, []);

  useEffect(() => {
    const newQuestion = {
      title,
      description,
      deadline,
      referenceSolution: {
        language,
        code: referenceSolutionCode,
      },
      testCases,
    };

    // only emit the updated question if it has changed, omitting initial question id field
    const initialQuestionWithoutId = { ...initialQuestion, id: undefined };
    if (
      JSON.stringify(newQuestion) !== JSON.stringify(initialQuestionWithoutId)
    ) {
      onQuestionChange(newQuestion);
    }
  }, [
    title,
    description,
    deadline,
    language,
    referenceSolutionCode,
    testCases,
  ]);

  const checkFormInputValidity = (field: string, value: string) => {
    switch (field) {
      case "title":
        const isTitleInvalid = value.length === 0 || value.length > 255;
        setIsTitleInvalid(isTitleInvalid);
        return !isTitleInvalid;
      case "deadline":
        const isDeadlineInvalid = new Date(value) < new Date();
        setIsDeadlineInvalid(isDeadlineInvalid);
        return !isDeadlineInvalid;
      case "description":
        const isDescriptionInvalid = value.length === 0 || value.length > 50000;
        setIsDescriptionInvalid(isDescriptionInvalid);
        return !isDescriptionInvalid;
      default:
        return false;
    }
  };

  return (
    <form className="grid mx-4 px-4 gap-8">
      {/* Question Title */}
      <div className="grid grid-cols-12">
        <FieldLabel isRequired>Question Title</FieldLabel>
        <Input
          className="col-span-9"
          value={title}
          onValueChange={(value) => {
            setTitle(value);
            checkFormInputValidity("title", value);
          }}
          placeholder="Enter you assignment title here"
          isInvalid={isTitleInvalid}
          errorMessage={
            isTitleInvalid && "Title must be between 1 and 255 characters long"
          }
          isRequired
        />
      </div>

      {/* Question Description */}
      <div className="grid grid-cols-12">
        <FieldLabel isRequired>Description</FieldLabel>
        <DescriptionField
          className="col-span-9"
          value={description}
          handleValueChanges={(value) => {
            setDescription(value);
            // remove html tags before checking length
            const strippedValue = value.replace(/(<([^>]+)>)/gi, "");
            checkFormInputValidity("description", strippedValue);
          }}
          placeholder="Enter the details, instructions, or provide a short description to the question"
          isInvalid={isDescriptionInvalid}
          errorMessage="Description must not be empty and should not be more than 50000 characters long"
        />
      </div>

      {/* Question Deadline */}
      <div className="grid grid-cols-12">
        <FieldLabel>Deadline</FieldLabel>
        <div className="col-span-9">
          <Checkbox
            isSelected={isAssignmentDeadline}
            onValueChange={setIsAssignmentDeadline}
          >
            Same as assignment deadline
          </Checkbox>

          <Input
            className="w-[40%] mt-2"
            type="datetime-local"
            value={DateUtils.toLocalISOString(new Date(deadline)).slice(0, 16)}
            onValueChange={(dateString) => {
              setDeadline(new Date(dateString).getTime());
              checkFormInputValidity("deadline", dateString);
            }}
            isInvalid={isDeadlineInvalid}
            errorMessage={isDeadlineInvalid && "Deadline must be in the future"}
            isDisabled={isAssignmentDeadline}
            isRequired
          />
        </div>
      </div>

      {/* Question Language */}
      <div className="grid grid-cols-12">
        <FieldLabel>Language</FieldLabel>
        <div className="col-span-9">
          <RadioGroup
            orientation="horizontal"
            value={language}
            onValueChange={setLanguage}
          >
            <Radio value="python">Python</Radio>
            <Radio value="c">C</Radio>
          </RadioGroup>
        </div>
      </div>

      {/* Question Reference Solution */}
      <div className="grid grid-cols-12">
        <FieldLabel>Reference Solution</FieldLabel>
        <div className="col-span-9">
          <div className="w-[40%]">
            <FileUpload
              expectedFileTypes={language === "python" ? ["py"] : ["c"]}
              onFileUpload={setReferenceSolutionCode}
              errorMessage="Invalid file type or file content"
            />
          </div>

          {referenceSolutionCode.length > 0 && (
            <Editor
              options={{
                minimap: {
                  enabled: false,
                },
                lineNumbers: "off",
                scrollbar: {
                  vertical: "hidden",
                  horizontal: "hidden",
                },
                readOnly: true,
              }}
              height={editorHeight}
              defaultLanguage={language}
              value={referenceSolutionCode}
              className="mt-2"
            />
          )}
        </div>
      </div>

      {/* Question Test Cases */}
      <div className="grid grid-cols-12">
        <FieldLabel>Test Cases</FieldLabel>
        <div className="col-span-9">
          <div className="flex">
            <div className="w-[40%]">
              <FileUpload
                expectedFileTypes={["json"]}
                onFileUpload={(fileContent) => {
                  if (!fileContent || fileContent.length === 0) {
                    setTestCases([]);
                    return;
                  }

                  const testCases = JSON.parse(fileContent) as TestCase[];
                  setTestCases(testCases);
                }}
                isTestCasesInput
                errorMessage="Invalid file type or file content"
              />
            </div>

            <Tooltip
              content={
                <div>
                  <div className="text-sm">
                    The test cases should be a JSON file with the following
                    format:
                  </div>
                  <div className="text-sm mt-2">
                    <pre>
                      {JSON.stringify(
                        [
                          {
                            input: "input1",
                            output: "output1",
                            isPublic: true,
                          },
                          {
                            input: "input2",
                            output: "output2",
                            isPublic: false,
                          },
                        ],
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              }
            >
              <div className="flex items-center ml-4">
                <Icons.QuestionMark />
              </div>
            </Tooltip>
          </div>

          <TestCasesInput testCases={testCases} setTestCases={setTestCases} />
        </div>
      </div>
    </form>
  );
}

export default QuestionEditor;
