"use client";

import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentList from "@/components/assignment/AssignmentList";
import { useUserContext } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export default function DashBoard() {
  const { user } = useUserContext();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["get-assignments", user?.uid],
    queryFn: async () => {
      return await AssignmentService.getAssignmentsByUserId(user?.uid ?? 0);
    },
  });

  return (
    <div className="h-screen">
      {isLoading ? (
        <LogoLoading />
      ) : (
        user ? (
          <AssignmentList assignments={assignments} userRole={user.role} />
        ) : (
          <></>
        )
      )}
    </div>
  );
}
