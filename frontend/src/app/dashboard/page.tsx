"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
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

const DashBoard = () => {
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
      assignment: "Assignment 1",
      date: new Date(2024, 1, 28, 23, 59, 0),
    },
    {
      assignment: "Assignment 1",
      date: new Date(2024, 1, 29, 23, 59, 0),
    },
    {
      assignment: "Assignment 2",
      date: new Date(2024, 2, 28, 23, 59, 0),
    },
    {
      assignment: "Assignment 2",
      date: new Date(2024, 2, 29, 23, 59, 0),
    },
    {
      assignment: "Assignment 3",
      date: new Date(2024, 3, 28, 23, 59, 0),
    },
    {
      assignment: "Assignment 4",
      date: new Date(2024, 4, 28, 23, 59, 0),
    },
    {
      assignment: "Assignment 5",
      date: new Date(2024, 5, 28, 23, 59, 0),
    },
  ];
  return (
    <div className="m-4">
      <b>Assignments</b>
      <Spacer y={4} />
      <Accordion variant="splitted">
        {list.map((item, index) => (
          <AccordionItem
            key={index}
            aria-label={item.title}
            title={item.title}
            className="bg-blue-200 text-blue-800"
          >
            <Button size="md">Medium</Button>
            <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>VIEW</TableColumn>
              </TableHeader>
              <TableBody>
                {submissions
                  .filter((submission) => submission.assignment === item.title)
                  .map((submission, index) => (
                    <TableRow key={index}>
                      <TableCell>{submission.date.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button color="primary">Click to view</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default DashBoard;
