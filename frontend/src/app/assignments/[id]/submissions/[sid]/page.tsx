"use client";

import { useEffect, useState } from "react";
import { Spacer, ButtonGroup, Button } from "@nextui-org/react";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import GradingService from "@/helpers/grading-service/api-wrapper";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import DateUtils from "../../../../../utils/dateUtils";
import FeedbackCodeEditor from "@/components/submission/FeedbackCodeEditor";
import FeedbackTabs from "@/components/submission/FeedbackTabs";
import FeedbackQuestion from "@/components/submission/FeedbackQuestion";

interface Props {
  params: {
    id: string;
    sid: string;
  };
}

export default function SubmissionPage({ params }: Props) {
  const userId = 1;
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [currentQuestionId, setCurrentQuestionId] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<number>(0);

  const handleQuestionChange = (questionNumber: number, questionId: string) => {
    setCurrentQuestion(questionNumber);
    setCurrentQuestionId(questionId);
    setSelectedSubmission(0);
  };

  const {
    data: assignment,
    // isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-assignment", params.id],
    queryFn: async () => {
      const assignment = await AssignmentService.getAssignmentById(params.id);
      return assignment;
    },
  });

  useEffect(() => {
    if (assignment && assignment.questions) {
      setCurrentQuestionId(assignment.questions[0]?.id ?? null);
    }
  }, [assignment]);

  const { data: submissions, refetch: refetchSubmissions } = useQuery({
    queryKey: ["get-submissions", params.id, currentQuestionId],
    queryFn: async () => {
      const submissions =
        await GradingService.getSubmissionByQuestionIdAndStudentId({
          questionId: currentQuestionId,
          studentId: userId,
        });

      return submissions;
    },
  });

  const { data: testCases, refetch: refetchTestCases } = useQuery({
    queryKey: ["get-testcases", params.id, currentQuestionId],
    queryFn: async () => {
      const testCases =
        await AssignmentService.getQuestionTestCases(currentQuestionId);

      return testCases;
    },
  });

  useEffect(() => {
    refetchSubmissions();
    refetchTestCases();
  }, [currentQuestionId]);

  if (isError) {
    return notFound();
  }

  return (
    <div>
      {assignment && (
        <div className="h-dvh flex p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 overflow-y-auto flex-1 max-w-1/2">
              <div>
                <ButtonGroup>
                  {assignment.questions?.map((question, index) => (
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
              {assignment.questions && (
                <FeedbackQuestion
                  question={assignment.questions[currentQuestion]}
                  key={assignment.questions[currentQuestion].id}
                />
              )}
            </div>
            <div className="col-span-1">
              <div className="row-span-1 border border-black">
                {submissions ? (
                  <FeedbackCodeEditor
                    submission={submissions[selectedSubmission]}
                    key={`${submissions[selectedSubmission].questionId}_${selectedSubmission}`}
                  />
                ) : (
                  <FeedbackCodeEditor key={"0"} />
                )}
              </div>
              <Spacer y={4} />
              <div className="row-span-1">
                {submissions ? (
                  <FeedbackTabs submission={submissions[selectedSubmission]} testcases={testCases} />
                ) : (
                  <FeedbackTabs />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
