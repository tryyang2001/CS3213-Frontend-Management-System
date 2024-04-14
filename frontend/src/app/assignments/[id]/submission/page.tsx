"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  Spacer,
  ButtonGroup,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import assignmentService from "@/helpers/assignment-service/api-wrapper";
import GradingService from "@/helpers/grading-service/api-wrapper";
import { useQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";
import DateUtils from "../../../../utils/dateUtils";
import FeedbackCodeEditor from "@/components/submission/FeedbackCodeEditor";
import FeedbackTabs from "@/components/submission/FeedbackTabs";
import FeedbackQuestion from "@/components/submission/FeedbackQuestion";

interface Props {
  params: {
    id: string;
  };
}

export default function SubmissionPage({ params }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [currentQuestionId, setCurrentQuestionId] = useState("");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState("");
  const search = useSearchParams();

  const handleQuestionChange = (questionNumber: number, questionId: string) => {
    setCurrentQuestion(questionNumber);
    setCurrentQuestionId(questionId);
  };

  const handleSubmissionSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubmissionId(e.target.value);
  };

  const {
    data: assignment,
    // isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-assignment", params.id],
    queryFn: async () => {
      const assignment = await assignmentService.getAssignmentById(params.id);
      return assignment;
    },
  });

  useEffect(() => {
    setCurrentQuestionId(assignment?.questions?.[0]?.id ?? "");
  }, [assignment]);

  const { data: submissions, refetch: refetchSubmissions } = useQuery({
    queryKey: ["get-submissions", params.id, currentQuestionId],
    queryFn: async () => {
      const studentId = search.get('studentId') as string | undefined;
      const parsedStudentId = studentId ? parseInt(studentId, 10) : 0;
      const submissions =
        await GradingService.getSubmissionsByQuestionIdAndStudentId({
          questionId: currentQuestionId,
          studentId: parsedStudentId,
        });

      const sortedSubmissions = submissions.sort(
        (a, b) => a.createdOn - b.createdOn
      );

      return sortedSubmissions;
    },
  });

  const { data: testCases, refetch: refetchTestCases } = useQuery({
    queryKey: ["get-testcases", params.id, currentQuestionId],
    queryFn: async () => {
      const testCases =
        await assignmentService.getQuestionTestCases(currentQuestionId);

      return testCases;
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetchSubmissions();
        await refetchTestCases();
      } catch (error) {
        console.log("Error fetching submission:", error);
      }
    };

    fetchData().catch((error) => {
      console.error("Error in fetchData:", error);
    });
  }, [currentQuestionId, refetchSubmissions, refetchTestCases]);

  useEffect(() => {
    if (submissions && submissions.length > 0) {
      setSelectedSubmissionId(submissions[0].id);
    }
  }, [submissions]);

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
              <div className="flex justify-end">
                <Select
                  items={submissions ? submissions : []}
                  label="Past Submissions"
                  placeholder="Select a submission"
                  className="max-w-xs"
                  onChange={handleSubmissionSelect}
                >
                  {(submission) => (
                    <SelectItem key={submission.id} value={submission.id}>
                      {submission.createdOn}
                    </SelectItem>
                  )}
                </Select>
              </div>
              <Spacer y={4} />
              <div className="row-span-1 border border-black">
                {submissions ? (
                  <FeedbackCodeEditor
                    submission={submissions.find(
                      (submission) => submission.id === selectedSubmissionId
                    )}
                  key={selectedSubmissionId}
                  />
                ) : (
                  <FeedbackCodeEditor key="0" />
                )}
              </div>
              <Spacer y={4} />
              <div className="row-span-1">
                {submissions ? (
                  <FeedbackTabs
                    submission={submissions.find(
                      (submission) => submission.id === selectedSubmissionId
                    )}
                    testcases={testCases}
                  />
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
