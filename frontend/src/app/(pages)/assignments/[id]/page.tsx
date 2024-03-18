"use client";

import AssignmentPage from "@/components/assignment/AssignmentPage";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

const Page = ({ params }: Props) => {
  const {
    data: assignment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-assignment", params.id],
    queryFn: async () => {
      const assignment = await AssignmentService.getAssignmentById({
        assignmentId: params.id,
      });

      return assignment;
    },
  });

  if (isError) {
    return notFound();
  }

  return (
    <div>
      {isLoading ? <LogoLoading /> : <AssignmentPage assignment={assignment} />}
    </div>
  );
};

export default Page;
