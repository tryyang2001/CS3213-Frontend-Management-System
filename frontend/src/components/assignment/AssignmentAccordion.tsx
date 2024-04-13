"use client";

import { Accordion, AccordionItem, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import DateUtils from "@/utils/dateUtils";
import { notFound, useRouter } from "next/navigation";

interface SubmissionData {
    questionId: string;
    questionNo: number;
    submissionDate: number;
}

interface Props {
  assignments: Assignment[] | undefined;
  userRole: string;
  submissions: {[key: string]: SubmissionData[]} 
}

function AssignmentAccordion({ assignments, userRole, submissions }: Props) {
  const router = useRouter();

  if (!assignments) {
    return notFound();
  }
  const handleButtonClick = (assignmentId: string) => {
    // Navigate to the desired route when the button is clicked
    router.push(`/assignments/${assignmentId}/submission`);
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
            <Button
              className="bg-primary text-white float-right"
              onPress={() =>
                handleButtonClick(assignment.id)
              }
            >
              View Submission
            </Button>
            <Table
              color="default"
              selectionMode="single"
              defaultSelectedKeys={[0]}
              aria-label={`Submissions table for ${assignment.title}`}
              shadow="none"
            >
              <TableHeader>
                <TableColumn>Question Number</TableColumn>
                <TableColumn>Submission Date and Time</TableColumn>
              </TableHeader>
              <TableBody
                items={submissions[assignment.id]}
              >
                {(submission) => (
                  <TableRow key={submission.questionId}>
                    <TableCell>{submission.questionNo}</TableCell>
                    <TableCell>{submission.submissionDate === 0 ?
                      "Not Submitted" : 
                      DateUtils.parseTimestampToDate(submission.submissionDate)}</TableCell>
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
