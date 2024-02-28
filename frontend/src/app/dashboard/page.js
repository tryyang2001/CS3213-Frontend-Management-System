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
            <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>VIEW</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>23 February 2024, 8.00PM</TableCell>
                  <TableCell>
                    <Button color="primary">Click to view</Button>
                  </TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>23 February 2024, 7.00PM</TableCell>
                  <TableCell>
                    <Button color="primary">Click to view</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default DashBoard;
