"use client";

import { Button, Card, CardBody, Spacer } from "@nextui-org/react";
import DateUtils from "@/utils/dateUtils";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoLoading from "../common/LogoLoading";

interface Props {
  assignments: Assignment[] | undefined;
  userRole: string | undefined;
}

function AssignmentList({ assignments, userRole }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userRole) {
      setIsLoading(false);
    }
  }, [userRole]);

  if (!assignments) {
    return notFound();
  }

  const handleButtonClick = (id: string) => {
    router.push(`/assignments/${id}`);
  };

  if (isLoading) {
    return <LogoLoading />;
  }

  return (
    <div>
      <b>Assignments</b>
      <Spacer y={4} />
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-1">
        {assignments.length === 0 && <div>There is no assignment due</div>}
        {assignments.length > 0 &&
          assignments.map((assignment) => (
            <Card
              shadow="sm"
              key={assignment.id}
              className="bg-white shadow-md"
            >
              <CardBody>
                <div className="flex justify-between items-start">
                  <div>
                    <b className="text-black">{assignment.title}</b>
                    <p className="text-black">
                      Deadline:{" "}
                      {DateUtils.parseTimestampToDate(assignment.deadline)}
                    </p>
                  </div>
                  <Button
                    color="primary"
                    size="md"
                    onClick={() => handleButtonClick(assignment.id)}
                  >
                    {userRole === "tutor" ? "View" : "New Attempt"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default AssignmentList;
