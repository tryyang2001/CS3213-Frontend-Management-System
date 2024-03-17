"use client";

import {
  Spacer,
  Accordion,
  AccordionItem,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";

const Submissions = () => {
  const list = [
    {
      title: "Assignment 1",
      deadline: new Date(2024, 1, 28, 23, 59, 0),
    },
    {
      title: "Assignment 2",
      deadline: new Date(2024, 2, 28, 23, 59, 0),
    },
    {
      title: "Assignment 3",
      deadline: new Date(2024, 3, 28, 23, 59, 0),
    },
    {
      title: "Assignment 4",
      deadline: new Date(2024, 4, 28, 23, 59, 0),
    },
    {
      title: "Assignment 5",
      deadline: new Date(2024, 5, 28, 23, 59, 0),
    },
  ];

  const submissions = [
    {
      id: "1",
      assignment: "Assignment 1",
      date: new Date(2024, 1, 28, 23, 59, 0),
    },
    {
      id: "2",
      assignment: "Assignment 1",
      date: new Date(2024, 1, 29, 23, 59, 0),
    },
    {
      id: "3",
      assignment: "Assignment 2",
      date: new Date(2024, 2, 28, 23, 59, 0),
    },
    {
      id: "4",
      assignment: "Assignment 2",
      date: new Date(2024, 2, 29, 23, 59, 0),
    },
    {
      id: "5",
      assignment: "Assignment 3",
      date: new Date(2024, 3, 28, 23, 59, 0),
    },
    {
      id: "6",
      assignment: "Assignment 4",
      date: new Date(2024, 4, 28, 23, 59, 0),
    },
    {
      id: "7",
      assignment: "Assignment 5",
      date: new Date(2024, 5, 28, 23, 59, 0),
    },
  ];

  const columns = [
    {
      key: "submission",
      label: "Submission Date and Time",
    },
    {
      key: "view",
      label: "Click to View",
    },
  ];

  return (
    <div className="h-screen">
      <b>Submissions</b>
      <Spacer y={4} />
      <Accordion variant="splitted">
        {list.map((item, index) => (
          <AccordionItem key={index} aria-label={item.title} title={item.title}>
            <Table isStriped aria-label={`Submissions table for ${item.title}`}>
              <TableHeader>
                <TableColumn>Submission Date and Time</TableColumn>
                <TableColumn width="20" align="end">
                  Click to View
                </TableColumn>
              </TableHeader>
              <TableBody
                items={submissions.filter(
                  (submission) => submission.assignment === item.title
                )}
              >
                {(submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.date.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button color="primary">View</Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Submissions;
