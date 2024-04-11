"use client";

import AssignmentPage from "@/components/assignment/AssignmentPage";
import AssignmentQuestion from "@/components/assignment/AssignmentQuestion";
import Icons from "@/components/common/Icons";
import LogoLoading from "@/components/common/LogoLoading";
import { useToast } from "@/components/ui/use-toast";
import { useAssignmentContext } from "@/contexts/assignment-context";
import { useUserContext } from "@/contexts/user-context";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { toast } = useToast();

  // TODO: replace below code with actual user context to check for user role
  const { user } = useUserContext();
  const userRole = user.role;

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

  const handleDeleteAssignment = (closeModal: () => void) => {
    AssignmentService.deleteAssignment(params.id)
      .then(() => {
        closeModal();
        router.push("/dashboard");
      })
      .catch((_err) =>
        toast({
          title: "Failed to delete assignment",
          description:
            "An unexpected error occurred while deleting the assignment. Please try again later.",
          variant: "destructive",
        })
      );
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
            {userRole === "student" && (
              <div className="ml-auto mr-4 my-2">
                <Button className="px-6" color="primary">
                  Submit
                </Button>
              </div>
            )}
            {
              // TODO: replace !== "student" with actual user role check, as for now not sure what the user role value is
              userRole === "tutor" && (
                <div className="flex ml-auto mr-4 my-2">
                  <Tooltip content="Edit assignment and questions">
                    <Button
                      isIconOnly
                      color="primary"
                      className="flex justify-center items-center bg-white text-black text-lg"
                      onClick={redirectToEditAssignmentPage}
                    >
                      <Icons.Edit />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Delete the assignment and its relevant questions">
                    <Button
                      isIconOnly
                      color="danger"
                      className="flex justify-center items-center bg-white text-danger text-lg"
                      onClick={onOpen}
                    >
                      <Icons.Delete />
                    </Button>
                  </Tooltip>
                  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                      {(onClose) => (
                        <div>
                          <ModalHeader>Confirm deletion?</ModalHeader>
                          <ModalBody>
                            <p>
                              The assignment and all its questions will be
                              deleted, and the action is irreversible.
                            </p>
                          </ModalBody>
                          <ModalFooter>
                            <Button color="secondary" onClick={onClose}>
                              Return
                            </Button>
                            <Button
                              color="danger"
                              onClick={() => handleDeleteAssignment(onClose)}
                            >
                              Confirm
                            </Button>
                          </ModalFooter>
                        </div>
                      )}
                    </ModalContent>
                  </Modal>
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
