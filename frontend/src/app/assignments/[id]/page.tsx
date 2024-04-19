"use client";

import { useEffect, useState } from "react";
import AssignmentPage from "@/components/assignment/AssignmentPage";
import AssignmentQuestion from "@/components/assignment/AssignmentQuestion";
import FileUpload from "@/components/common/FileUpload";
import Icons from "@/components/common/Icons";
import LogoLoading from "@/components/common/LogoLoading";
import { useToast } from "@/components/ui/use-toast";
import { useAssignmentContext } from "@/contexts/assignment-context";
import { useUserContext } from "@/contexts/user-context";
import assignmentService from "@/helpers/assignment-service/api-wrapper";
import GradingService from "@/helpers/grading-service/api-wrapper";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
  Divider,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { notFound, useRouter } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

interface FileContent {
  language: string;
  fileContent: string;
}

export default function Page({ params }: Props) {
  const router = useRouter();

  const { enableEditing } = useAssignmentContext();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { toast } = useToast();

  const { user } = useUserContext();

  const userId = user?.uid ?? 0;
  const userRole = user?.role;

  const [isLoadingUserRole, setIsLoadingUserRole] = useState(true);

  useEffect(() => {
    if (userRole) {
      setIsLoadingUserRole(false);
    }
  }, [userRole]);

  const [fileContents, setFileContents] = useState<Record<string, FileContent>>(
    {}
  );
  const [submissionStatus, setSubmissionStatus] =
    useState<Record<string, boolean>>();

  const {
    data: assignment,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ["get-assignment", params.id],
    queryFn: async () => {
      const assignment = await assignmentService.getAssignmentById(params.id);

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

  const redirectToSubmissionPage = (questionId: string) => {
    localStorage.setItem("currentQuestionId", questionId);
    router.push(`/assignments/${params.id}/submission?studentId=${user?.uid}`);
  };

  const handleDeleteAssignment = (closeModal: () => void) => {
    assignmentService
      .deleteAssignment(params.id)
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

  const handleFileUpload = (
    fileContent: string,
    questionId: string,
    language: string
  ) => {
    setFileContents((prevState) => ({
      ...prevState,
      [questionId]: { fileContent: fileContent, language: language },
    }));
  };

  const handleSubmitCode = (questionId: string) => {
    if (fileContents?.[questionId]) {
      const { language, fileContent } = fileContents[questionId];
      const requestBody: PostFeedbackBody = {
        language: language,
        source_code: fileContent,
        question_id: questionId,
        student_id: userId,
      };
      GradingService.postFeedback(requestBody)
        .then(() => {
          toast({
            title: "Code uploaded successfully",
            description:
              "Code uploaded successfully. Feedback will be available shortly.",
            variant: "success",
          });
          setSubmissionStatus((prevState) => ({
            ...prevState,
            [questionId]: true,
          }));
        })
        .catch((_err) => {
          toast({
            title: "Failed to upload code",
            description:
              "An error occurred while uploading code. Please try again.",
            variant: "destructive",
          });
        });
    }
  };

  if (isLoadingUserRole) {
    return <LogoLoading />;
  }

  return (
    <div>
      {isFetched ? (
        <div className="ml-[12%] mt-[5%] mr-[8%]">
          <div className="flex gap-2">
            {/* Assignment details */}
            <AssignmentPage assignment={assignment} />

            {/* Button for submission */}
            {userRole === "student" && (
              <div className="ml-auto my-2">
                <Button className="px-6" color="primary" onPress={onOpen}>
                  Submit
                </Button>
                <Modal
                  size="xl"
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  isDismissable={false}
                  isKeyboardDismissDisabled={true}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex items-center justify-between mt-4">
                          Submit
                          <Button onPress={() => redirectToSubmissionPage("")}>
                            View Previous Submissions
                          </Button>
                        </ModalHeader>
                        <ModalBody>
                          <p>
                            Submit your answer to each question individually.
                          </p>
                          <Divider className="my-4" />
                          {assignment!.questions!.map((question) => {
                            return (
                              <div key={question.id}>
                                <div
                                  className="flex items-center"
                                  key={question.id}
                                >
                                  <p className="w-1/4">{question.title}</p>
                                  <div className="w-1/2 m-1">
                                    <FileUpload
                                      expectedFileTypes={["py"]}
                                      onFileUpload={(fileContent) => {
                                        if (
                                          !fileContent ||
                                          fileContent.length === 0
                                        ) {
                                          return;
                                        }

                                        handleFileUpload(
                                          fileContent,
                                          question.id,
                                          "python"
                                        );
                                      }}
                                    />
                                  </div>
                                  <Button
                                    className="w-1/4"
                                    onPress={() =>
                                      handleSubmitCode(question.id)
                                    }
                                  >
                                    Submit
                                  </Button>
                                </div>
                                {submissionStatus?.[question.id] && (
                                  <Button
                                    onPress={() =>
                                      redirectToSubmissionPage(question.id)
                                    }
                                    fullWidth={true}
                                  >
                                    View Feedback
                                  </Button>
                                )}
                                <Divider className="my-4" />
                              </div>
                            );
                          })}
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          {/* <Button color="primary" onPress={onClose}>
                            Action
                          </Button> */}
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            )}
            {userRole === "tutor" && (
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
            )}
          </div>

          {/* Assignment questions */}
          {assignment!.questions!.map((question) => {
            return <AssignmentQuestion question={question} key={question.id} />;
          })}
        </div>
      ) : (
        <LogoLoading />
      )}
    </div>
  );
}
