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

export default function Submissions() {
  const [isSelected, setIsSelected] = useState(false);

  const router = useRouter();

  const handleButtonClick = (aid: string, sid: string) => {
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
                  <TableColumn className="w-20 text-right">
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
                  {(submission) => (
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
                            className="bg-primary text-white"
                            onPress={() =>
                              handleButtonClick(submission.id, submission.id)
                            }
                          >
                            View
                          </Button>
                        ) : (
                          <Button isDisabled className="bg-primary text-white">
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
                  <TableColumn className="w-20 text-right">
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
                          className="bg-primary text-white"
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
}
