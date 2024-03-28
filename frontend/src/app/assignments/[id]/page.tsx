"use client";

import AssignmentPage from "@/components/assignment/AssignmentPage";
import AssignmentQuestion from "@/components/assignment/AssignmentQuestion";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  const {
    data: assignment,
    isLoading,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ["get-assignment", params.id],
    queryFn: async () => {
      const assignment = await AssignmentService.getAssignmentById(params.id);

      return assignment;
    },
  });

  if (isError || (isFetched && !assignment)) {
    return notFound();
  }

  return (
    <div>
      {isLoading ? (
        <LogoLoading />
      ) : (
        <div className="ml-[12%] mt-[5%] mr-[8%]">
          <div className="flex gap-2">
            {/* Assignment details */}
            <AssignmentPage assignment={assignment!} />

            {/* Button for submission */}
            <div className="ml-auto mr-4 my-2">
              <Button className="px-6" color="primary">
                Submit
              </Button>
            </div>
          </div>

          {/* Assignment questions */}
          {assignment!.questions!.map((question) => {
            return <AssignmentQuestion question={question} key={question.id} />;
          })}
        </div>
      )}
    </div>
  );
}
