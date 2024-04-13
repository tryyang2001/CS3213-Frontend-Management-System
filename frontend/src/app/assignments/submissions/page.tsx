"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import assignmentService from "@/helpers/assignment-service/api-wrapper";
import { useUserContext } from "@/contexts/user-context";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentAccordion from "@/components/assignment/AssignmentAccordion";
import GradingService from "@/helpers/grading-service/api-wrapper";

interface SubmissionData {
  questionId: string;
  questionNo: number;
  submissionDate: number;
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState<{[key: string]: SubmissionData[]}>({});
  const router = useRouter();

  const handleButtonClick = (aid: string, sid: string) => {
    // Navigate to the desired route when the button is clicked
    router.push(`/assignments/${aid}/submissions/${sid}`);
  };

  const { user } = useUserContext();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["get-assignments", user],
    queryFn: async () => {
      if (!user) {
        return [];
      }
      const submissionsData: { [key: string]: SubmissionData[] } = {};
      if (user.role === "student") {
        // Retrieve assignments that are published
        const assignments =  await assignmentService.getAssignmentsByUserId(
          user.uid,
          true,
          true
        );
        for (const assignment of assignments) {
          const assignmentQuestionsData = [];
          // Get the questions belonging to the assignments
          const assignmentData = await assignmentService.getAssignmentById(assignment.id);
          if (assignmentData?.questions && user) {
            const questionIds = assignmentData.questions.map(question => question.id);
            let questionNo = 1;
            for (const questionId of questionIds) {
              // Get the submission date of each of the question if exists
              const submissionData = await GradingService.getSubmissionByQuestionIdAndStudentId({questionId: questionId, studentId: user.uid})
              const submissionDate = submissionData.createdOn 
              assignmentQuestionsData.push({questionId: questionId, questionNo: questionNo++, submissionDate: submissionDate})
            }
          }
          submissionsData[assignment.id] = assignmentQuestionsData;
          
        }
        setSubmissions(submissionsData);
        return assignments;
      }
      // Retrieve all assignments that are not past the deadline
      return await assignmentService.getAssignmentsByUserId(
        user.uid,
        true,
        false
      );
    },
  });

  return (
    <div className="h-screen">
      {(isLoading) ?
       (<LogoLoading/>) :
       (<AssignmentAccordion assignments={assignments} userRole={user?.role ?? ""} submissions={submissions}/>)
      }
    </div>
  );
}
