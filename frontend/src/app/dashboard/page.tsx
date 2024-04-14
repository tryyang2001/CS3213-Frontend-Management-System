"use client";

import assignmentService from "@/helpers/assignment-service/api-wrapper";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentList from "@/components/assignment/AssignmentList";
import { useUserContext } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export default function DashBoard() {
  const { user } = useUserContext();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["get-assignments", user],
    queryFn: async () => {
      if (!user) {
        return [];
      }

      if (user?.role === "student") {
        // only retrieve assignments that are published and not past the deadline
        return await assignmentService.getAssignmentsByUserId(
          user.uid,
          false,
          true
        );
      }

      // retrieve all assignments that are not past the deadline
      return await assignmentService.getAssignmentsByUserId(user.uid);
    },
  });

  return (
    <div className="h-dvh">
      {isLoading ? (
        <LogoLoading />
      ) : (
        <AssignmentList assignments={assignments} userRole={user?.role} />
      )}
    </div>
  );
}
