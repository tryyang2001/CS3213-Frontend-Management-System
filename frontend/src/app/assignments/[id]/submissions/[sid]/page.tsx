"use client";

import { MutableRefObject, useRef, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import DateUtils from "../../../../../utils/dateUtils";
import * as monaco from "monaco-editor";
import FeedbackCodeEditor from "@/components/assignment/FeedBackCodeEditor";
import FeedbackTabs from "@/components/assignment/FeedbackTabs";
import AssignmentPage from "@/components/assignment/AssignmentPage";
import LogoLoading from "@/components/common/LogoLoading";
import FeedbackQuestion from "@/components/assignment/FeedbackQuestion";

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
  // const [value, setValue] = useState("");
  // const [language, setLanguage] = useState("python");

  const [currentPage, setCurrentPage] = useState<number>(0); // Start from the first question

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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

  if (isError) {
    return notFound();
  }

  const code = `def is_odd(x):
  if x % 2 == 1:
    return False
  else:
    return True
  `;

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
                      onClick={() => handlePageChange(index)}
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
                question={assignment.questions[currentPage]}
                key={assignment.questions[currentPage].id}
              />
            </div>
            <div className="col-span-1">
              <div className="row-span-1 border border-black">
                <FeedbackCodeEditor code={code} feedback={feedback} />
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
