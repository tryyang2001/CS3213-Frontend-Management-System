"use client";

import AssignmentPage from "@/components/assignment/AssignmentPage";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { useQuery } from "@tanstack/react-query";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  const { data: assignment, isLoading } = useQuery({
    queryKey: ["get-assignment", params.id],
    queryFn: async () => {
      const assignment = await AssignmentService.getAssignmentById(params.id);

      return assignment;
    },
  });

  return (
    <div>
      {isLoading ? <LogoLoading /> : <AssignmentPage assignment={assignment} />}
    </div>
  );
}
