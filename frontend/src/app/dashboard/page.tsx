"use client";

import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentList from "@/components/assignment/AssignmentList";
import { useUserContext } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function DashBoard() {
  const { user } = useUserContext();
  const { toast } = useToast();
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>();
  useEffect(() => {
    if (!(user && Cookies.get('token'))) {
      toast({
        title: "You must login to view dashboard",
        description: "Please login and try again",
        variant: "destructive",
      });
      route.push('/login');
    } else {
      const { data: assignments, isLoading } = useQuery({
        queryKey: ["get-assignments", user.uid],
        queryFn: async () => {
          return await AssignmentService.getAssignmentsByUserId(user.uid);
        },
      });
      setIsLoading(isLoading);
      setAssignments(assignments);
    }
  }, [user]);


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
