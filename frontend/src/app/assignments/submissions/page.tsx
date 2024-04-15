"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import assignmentService from "@/helpers/assignment-service/api-wrapper";
import { useUserContext } from "@/contexts/user-context";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentAccordion from "@/components/assignment/AssignmentAccordion";
import GradingService from "@/helpers/grading-service/api-wrapper";
import userService from "@/helpers/user-service/api-wrapper";

interface SubmissionData {
  questionId: string;
  questionNo: number;
  submissionDate: number;
  name: string;
  studentId: number;
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState<
    Record<string, SubmissionData[]>
  >({});

  const { user } = useUserContext();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["get-assignments", user],
    queryFn: async () => {
      if (!user) {
        return [];
      }
      const submissionsData: Record<string, SubmissionData[]> = {};
      if (user.role === "student") {
        // Retrieve all assignments that are published
        const assignments = await assignmentService.getAssignmentsByUserId(
          user.uid,
          true,
          true
        );

        await Promise.all(
          assignments.map(async (assignment) => {
            const assignmentSubmissionsData: SubmissionData[] = [];
            // Fetch submissionInfo for the current assignment
            const submissionInfos = await GradingService.getSubmissionInfo({
              assignmentId: assignment.id,
              studentId: user.uid,
            });
            let questionNo = 1;
            submissionInfos?.forEach((submissionInfo) => {
              assignmentSubmissionsData.push({
                questionId: submissionInfo.questionId,
                questionNo: questionNo++,
                name: "",
                submissionDate: submissionInfo.createdOn,
                studentId: user.uid,
              });
            });
            submissionsData[assignment.id] = assignmentSubmissionsData;
          })
        );
        setSubmissions(submissionsData);
        return assignments;
      }

      if (user.role === "tutor") {
        const [assignments, students] = await Promise.all([
          assignmentService.getAssignmentsByUserId(user.uid, true, false),
          userService.getAllStudents(user.uid),
        ]);

        await Promise.all(
          assignments.map(async (assignment) => {
            const assignmentSubmissionsData: SubmissionData[] = [];
            // Fetch submitters for the current assignment
            const submitters = await GradingService.getSubmittersByAssignmentId(
              assignment.id
            );
            students?.forEach((student) => {
              const submitted = submitters.find(
                (submitter) => submitter.studentId === student.uid
              );
              assignmentSubmissionsData.push({
                questionId: crypto.randomUUID(),
                questionNo: 0,
                name: student.name,
                submissionDate: submitted ? submitted.createdOn : 0,
                studentId: student.uid,
              });
            });
            submissionsData[assignment.id] = assignmentSubmissionsData;
          })
        );
        setSubmissions(submissionsData);
        return assignments;
      }
    },
  });

  return (
    <div className="h-dvh">
      {isLoading ? (
        <LogoLoading />
      ) : (
        <AssignmentAccordion
          assignments={assignments}
          userRole={user?.role ?? ""}
          submissions={submissions}
        />
      )}
    </div>
  );
}
