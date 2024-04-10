"use client";

import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentList from "@/components/assignment/AssignmentList";
import { useUserContext } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function DashBoard() {
  const { user } = useUserContext();
  const { toast } = useToast();
  const route = useRouter();

  if (!(user && Cookies.get('token'))) {
    toast({
      title: "You must login to view dashboard",
      description: "Please login and try again",
      variant: "destructive",
    });
    route.push('/login');
  }

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["get-assignments", user?.uid ?? 0],
    queryFn: async () => {
      return await AssignmentService.getAssignmentsByUserId(user?.uid ?? 0);
    }
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
