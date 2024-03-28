"use client";

import { useQuery } from "@tanstack/react-query";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentList from "@/components/assignment/AssignmentList";

export default function DashBoard() {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ["get-assignments", "rui_yang_tan_user_id_1"],
    queryFn: async () => {
      const assignments = await AssignmentService.getAssignmentsByUserId(
        // TODO: Retrieve the actual logged in user ID from a user context or any equivalent
        "rui_yang_tan_user_id_1"
      );

      console.log(assignments);

      return assignments;
    },
  });

  return (
    <div className="h-screen">
      {isLoading ? (
        <LogoLoading />
      ) : (
        <AssignmentList assignments={assignments} />
      )}
    </div>
  );
}
