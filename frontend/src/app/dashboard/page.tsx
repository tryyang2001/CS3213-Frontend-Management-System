"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spacer,
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
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-1">
        {list.map((item, index) => (
          <Card
            shadow="sm"
            key={index}
            // isPressable
            // onPress={() => console.log("item pressed")}
          >
            <CardBody>
              <div className="flex justify-between items-start">
                <div>
                  <b>{item.title}</b>
                  <p>Deadline: {item.deadline.toUTCString()}</p>
                </div>
                <Button color="primary" size="md">
                  New Attempt
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashBoard;
