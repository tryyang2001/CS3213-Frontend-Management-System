"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Spacer,
  Divider,
  ButtonGroup,
  Button,
  Code,
} from "@nextui-org/react";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import GradingService from "@/helpers/grading-service/api-wrapper";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import DateUtils from "../../../../../utils/dateUtils";
import FeedbackCodeEditor from "@/components/assignment/FeedbackCodeEditor";
import FeedbackTabs from "@/components/assignment/FeedbackTabs";
import FeedbackQuestion from "@/components/assignment/FeedbackQuestion";

interface Props {
  params: {
    id: string;
    sid: string;
  };
}

export default function SubmissionPage({ params }: Props) {
  // const [value, setValue] = useState("");
  // const [language, setLanguage] = useState("python");

  const [currentQuestion, setCurrentQuestion] = useState<number>(0); // Start from the first question

  const [currentQuestionId, setCurrentQuestionId] = useState("");

  const handleQuestionChange = (questionNumber: number, questionId: string) => {
    setCurrentQuestion(questionNumber);
    setCurrentQuestionId(questionId);
  };

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

  useEffect(() => {
    if (assignment && assignment.questions && assignment.questions.length > 0) {
      setCurrentQuestionId(assignment.questions[0].id);
    }
  }, [assignment]);

  const { data: submission, refetch: refetchSubmissions } = useQuery({
    queryKey: ["get-submissions", params.id, currentQuestionId],
    queryFn: async () => {
      const submission =
        await GradingService.getSubmissionByQuestionIdAndStudentId({
          questionId: currentQuestionId,
          studentId: "1",
        });

      return submission;
    },
  });

  useEffect(() => {
    refetchSubmissions();
  }, [currentQuestionId]);

  if (isError) {
    return notFound();
  }

  const feedback = {
    line: 2,
    hints: ["Incorrect else block for if ( ((x % 2) == 1) )"],
  };

  return (
    <div>
      {assignment && (
        <div className="h-dvh flex p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 overflow-y-auto flex-1 max-w-1/2">
              <div>
                <ButtonGroup>
                  {assignment.questions.map((question, index) => (
                    <Button
                      key={question.id}
                      onClick={() => handleQuestionChange(index, question.id)}
                    >{`${index + 1}`}</Button>
                  ))}
                </ButtonGroup>
              </div>
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
                  </div>
                </div>
              </div>
              <FeedbackQuestion
                question={assignment.questions[currentQuestion]}
                key={assignment.questions[currentQuestion].id}
              />
            </div>
            <div className="col-span-1">
              <div className="row-span-1 border border-black">
                {submission ? (
                  <FeedbackCodeEditor
                    key={submission.questionId}
                    code={submission.code}
                    feedback={feedback}
                  />
                ) : (
                  <FeedbackCodeEditor key={"0"} />
                )}
              </div>
              <Spacer y={4} />
              <div className="row-span-1">
                <FeedbackTabs />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
