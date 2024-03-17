"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Switch,
} from "@nextui-org/react";

const Submissions = () => {
  const [isSelected, setIsSelected] = useState(false);

  const router = useRouter();

  const handleButtonClick = (aid: String, sid: String) => {
    // Navigate to the desired route when the button is clicked
    router.push(`/assignments/${aid}/submissions/${sid}`);
  };

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

  const studentSubmissions = [
    {
      id: "1",
      assignment: "Assignment 1",
      name: "Adam Tan",
      submitted: true,
      date: new Date(2024, 1, 28, 23, 59, 0),
    },
    {
      id: "2",
      assignment: "Assignment 1",
      name: "Ben Lee",
      submitted: true,
      date: new Date(2024, 1, 28, 23, 59, 0),
    },
    {
      id: "3",
      assignment: "Assignment 1",
      name: "Carol Tay",
      submitted: false,
      date: new Date(2024, 1, 28, 23, 59, 0),
    },
    {
      id: "4",
      assignment: "Assignment 2",
      name: "Adam Tan",
      submitted: true,
      date: new Date(2024, 1, 28, 23, 59, 0),
    },
    {
      id: "5",
      assignment: "Assignment 2",
      name: "Ben Lee",
      submitted: false,
      date: new Date(2024, 1, 28, 23, 59, 0),
    },
    {
      id: "6",
      assignment: "Assignment 3",
      name: "Carol Tay",
      submitted: false,
      date: new Date(2024, 1, 28, 23, 59, 0),
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
      <Switch isSelected={isSelected} onValueChange={setIsSelected}>
        Tutor view
      </Switch>
      <p className="text-small text-default-500">
        Selected: {isSelected ? "Tutor's view" : "Student's view"}
      </p>
      <Spacer y={4} />
      {isSelected ? (
        <Accordion variant="splitted" selectionMode="multiple">
          {list.map((item, index) => (
            <AccordionItem
              key={index}
              aria-label={item.title}
              title={item.title}
            >
              <Table
                color="default"
                selectionMode="single"
                defaultSelectedKeys={[0]}
                aria-label={`Submissions table for ${item.title}`}
                shadow="none"
              >
                <TableHeader>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Submission Date and Time</TableColumn>
                  <TableColumn width="20" align="end">
                    Click to View
                  </TableColumn>
                </TableHeader>
                <TableBody
                  items={studentSubmissions
                    .filter(
                      (submission) => submission.assignment === item.title
                    )
                    .sort((a, b) => {
                      return a.name.localeCompare(b.name);
                    })}
                >
                  {(submission: any) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.name}</TableCell>
                      <TableCell>
                        {submission.submitted
                          ? submission.date.toLocaleString()
                          : "Not Submitted"}
                      </TableCell>
                      <TableCell>
                        {submission.submitted ? (
                          <Button
                            color="primary"
                            onPress={() =>
                              handleButtonClick(submission.id, submission.id)
                            }
                          >
                            View
                          </Button>
                        ) : (
                          <Button isDisabled color="primary">
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Accordion variant="splitted" selectionMode="multiple">
          {list.map((item, index) => (
            <AccordionItem
              key={index}
              aria-label={item.title}
              title={item.title}
            >
              <Table
                color="default"
                selectionMode="single"
                defaultSelectedKeys={[0]}
                aria-label={`Submissions table for ${item.title}`}
                shadow="none"
              >
                <TableHeader>
                  <TableColumn>Submission Date and Time</TableColumn>
                  <TableColumn width="20" align="end">
                    Click to View
                  </TableColumn>
                </TableHeader>
                <TableBody
                  items={submissions
                    .filter(
                      (submission) => submission.assignment === item.title
                    )
                    .sort((a, b) => {
                      return b.date.getTime() - a.date.getTime();
                    })}
                >
                  {(submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.date.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          onPress={() =>
                            handleButtonClick(submission.id, submission.id)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default Submissions;
