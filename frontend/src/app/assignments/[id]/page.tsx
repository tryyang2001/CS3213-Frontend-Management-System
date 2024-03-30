"use client";

import AssignmentPage from "@/components/assignment/AssignmentPage";
import AssignmentQuestion from "@/components/assignment/AssignmentQuestion";
import Icons from "@/components/common/Icons";
import LogoLoading from "@/components/common/LogoLoading";
import { useAssignmentContext } from "@/contexts/assignment-context";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { notFound, useRouter } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  const router = useRouter();

  const { enableEditing } = useAssignmentContext();

  // TODO: replace below code with actual user context to check for user role
  const userRole = "tutor";

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

  const redirectToEditAssignmentPage = () => {
    enableEditing(assignment!);
    router.push(`/assignments/${params.id}/edit`);
  };

  return (
    <div>
      {isLoading ? (
        <LogoLoading />
      ) : (
        <div className="ml-[12%] mt-[5%] mr-[8%]">
          <div className="flex gap-2">
            {/* Assignment details */}
            <AssignmentPage assignment={assignment} />

            {/* Button for submission */}
            {/* {userRole === "student" && (
              <div className="ml-auto mr-4 my-2">
                <Button className="px-6" color="primary">
                  Submit
                </Button>
              </div>
            )} */}
            {
              // TODO: replace !== "student" with actual user role check, as for now not sure what the user role value is
              userRole === "tutor" && (
                <div className="ml-auto mr-4 my-2">
                  <Button
                    isIconOnly
                    color="primary"
                    className="flex justify-center items-center bg-white text-black text-lg"
                    onClick={redirectToEditAssignmentPage}
                  >
                    <Icons.Edit />
                  </Button>
                </div>
              )
            }
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
