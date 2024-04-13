"use client";

import { Accordion, AccordionItem, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import DateUtils from "@/utils/dateUtils";
import { notFound, useRouter } from "next/navigation";

interface SubmissionData {
    questionId: string;
    questionNo: number;
    submissionDate: number;
    name: string;
    studentId: number;
}

interface Props {
  assignments: Assignment[] | undefined;
  userRole: string;
  submissions: Record<string, SubmissionData[]> 
}

function AssignmentAccordion({ assignments, userRole, submissions }: Props) {
  const router = useRouter();
  if (!assignments) {
    return notFound();
  }
  const handleButtonClick = (assignmentId: string, studentId: number) => {
    // Navigate to the desired route when the button is clicked
    router.push(`/assignments/${assignmentId}/submission?studentId=${studentId}`);
  };
  
  return (
    <div>
      <b>Submissions</b>
      <Accordion variant="splitted" selectionMode="multiple">
        {assignments.map((assignment) => (
          <AccordionItem
            key={assignment.id}
            aria-label={assignment.title}
            title={assignment.title}
          >
            {userRole === 'student' && (<Button
              className="bg-primary text-white float-right"
              onPress={() =>
                handleButtonClick(assignment.id, submissions[assignment.id][0].studentId)
              }
            >
              View Submission
            </Button>)}
            <Table
              color="default"
              selectionMode="single"
              defaultSelectedKeys={[0]}
              aria-label={`Submissions table for ${assignment.title}`}
              shadow="none"
            >
              <TableHeader>
                <TableColumn>{userRole === 'student' ? 'Question Number' : 'Student Name'}</TableColumn>
                <TableColumn>Submission Date and Time</TableColumn>
                {userRole === 'tutor' ? (<TableColumn>Click to view</TableColumn>) : <TableColumn><></></TableColumn>}
              </TableHeader>
              <TableBody
                items={submissions[assignment.id] 
                ? submissions[assignment.id].sort((a, b) => {
                  return a.name.localeCompare(b.name);
                }) : []}
              >
                {(submission) => (
                  <TableRow key={submission.questionId}>
                    <TableCell>{userRole === 'student' ? submission.questionNo : submission.name}</TableCell>
                    <TableCell>{submission.submissionDate === 0 ?
                      "Not Submitted" : 
                      DateUtils.parseTimestampToDate(submission.submissionDate)}</TableCell>
                    {userRole === 'tutor' ? 
                    (<TableCell>
                      <Button
                        className = "bg-primary text-white"
                        isDisabled={submission.submissionDate === 0}
                        onClick={() =>
                          handleButtonClick(assignment.id, submission.studentId)
                        }
                      >
                        {submission.submissionDate !== 0 ? 'View Submission' : 'No Submission'}
                      </Button>
                    </TableCell>) : <TableCell><></></TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default AssignmentAccordion;
