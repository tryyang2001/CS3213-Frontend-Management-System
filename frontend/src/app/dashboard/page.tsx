"use client";

import { useQuery } from "@tanstack/react-query";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentList from "@/components/assignment/AssignmentList";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "next/navigation";

export default function DashBoard() {
  const { user } = useUserContext();

  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["get-assignments", user?.uid],
    queryFn: async () => {
      if (!user) {
        router.push("/");
        return [];
      }
      const assignments = await AssignmentService.getAssignmentsByUserId(
        // TODO: Retrieve the actual logged in user ID from a user context or any equivalent
        user.uid
      );

      return assignments;
    },
  });

  return (
    <div className="h-screen">
      {isLoading ? (
        <LogoLoading />
      ) : (
        <AssignmentList assignments={assignments} userRole={user.role} />
      )}
    </div>
  );
}
