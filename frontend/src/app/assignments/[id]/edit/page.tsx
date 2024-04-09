"use client";

import AssignmentEditor from "@/components/assignment/create/AssignmentEditor";
import QuestionEditor from "@/components/assignment/create/QuestionEditor";
import Icons from "@/components/common/Icons";
import LogoLoading from "@/components/common/LogoLoading";
import { useToast } from "@/components/ui/use-toast";
import { useAssignmentContext } from "@/contexts/assignment-context";
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
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

function Page({ params }: Props) {
  const router = useRouter();

  const { assignment, isEditing, disableEditing } = useAssignmentContext();

  const [updatedQuestions, setUpdatedQuestions] = useState<
    CreateQuestionBody[]
  >([
    {
      title: "",
      description: "",
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);

  const { toast } = useToast();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchQuestions = async () => {
    // if assignment has questions, obtain the reference solution and test cases for each question
    if (assignment?.questions?.length ?? 0 > 0) {
      const assignmentQuestions = assignment!.questions!;
      const questionIds = assignmentQuestions.map((question) => question.id);

      const referenceSolutions = await Promise.all(
        questionIds.map((questionId) =>
          AssignmentService.getQuestionReferenceSolution(questionId)
        )
      );

      const questionTestCases = await Promise.all(
        questionIds.map((questionId) =>
          AssignmentService.getQuestionTestCases(questionId)
        )
      );

      const questions: CreateQuestionBody[] = assignmentQuestions.map(
        (question, index) => {
          const rawReferenceSolution = referenceSolutions[index];
          const referenceSolution = rawReferenceSolution && {
            language: rawReferenceSolution.language,
            code: rawReferenceSolution.code,
          };

          return {
            id: question.id,
            title: question.title,
            description: question.description,
            deadline: question.deadline,
            referenceSolution: referenceSolution,
            testCases: questionTestCases[index],
          };
        }
      );

      setUpdatedQuestions(questions);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!assignment || !isEditing) {
      router.push(`/assignments/${params.id}`);
      return;
    }

    // obtain reference solution and test cases for each question in assignment
    fetchQuestions().catch((_error) => {
      notFound();
    });

    return () => {
      disableEditing();
    };
  }, []);

  const handleAddQuestion = () => {
    setUpdatedQuestions([
      ...updatedQuestions,
      {
        title: "",
        description: "",
      },
    ]);
  };

  const handleDeleteQuestion = (index: number) => {
    const deletedQuestionId = updatedQuestions[index].id;

    if (deletedQuestionId) {
      setDeletedQuestionIds([...deletedQuestionIds, deletedQuestionId]);
    }

    setUpdatedQuestions((prevQuestions) =>
      prevQuestions.filter((_, idx) => idx !== index)
    );
  };

  const handleQuestionChange = (
    updatedQuestion: CreateQuestionBody,
    index: number
  ) => {
    setUpdatedQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];

      // except id, update all attributes of the question
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        ...updatedQuestion,
      };

      return updatedQuestions;
    });
  };

  const handleUpdateQuestions = () => {
    // for each question ids in deletedQuestionIds, delete the question
    const deleteQuestionPromises = Promise.all(
      deletedQuestionIds.map((questionId) =>
        AssignmentService.deleteQuestion(questionId)
      )
    );

    // for each question in updatedQuestions, if question.id exists, update the question, else create the question
    const updateQuestionPromises = Promise.all(
      updatedQuestions.map((question) => {
        if (question.id) {
          return AssignmentService.updateQuestion(question.id, {
            ...question,
            id: undefined,
          });
        } else {
          return AssignmentService.createQuestion(params.id, {
            ...question,
            id: undefined,
          });
        }
      })
    );

    // combine the promises
    Promise.all([deleteQuestionPromises, updateQuestionPromises])
      .then(() => {
        toast({
          title: "Questions updated successfully",
          description: "The questions have been updated successfully.",
          variant: "success",
        });
      })
      .catch((_error) => {
        toast({
          title: "Failed to update questions",
          description:
            "An error occurred while updating questions. Please check the inputs and try again.",
          variant: "destructive",
        });
      });
  };

  const checkQuestionInputValidity = (question: CreateQuestionBody) => {
    if (question.title.length === 0 || question.title.length > 255) {
      return {
        isValid: false,
        errorMessage: "Title must be between 1 and 255 characters.",
      };
    }

    const strippedDescription = question.description.replace(/<[^>]*>/g, "");

    if (
      strippedDescription.length === 0 ||
      strippedDescription.length > 50000
    ) {
      return {
        isValid: false,
        errorMessage: "Description must be between 1 and 50000 characters.",
      };
    }

    if (new Date(question.deadline as number) < new Date()) {
      return {
        isValid: false,
        errorMessage: "Deadline must be in the future.",
      };
    }

    if (question.referenceSolution?.code.length === 0) {
      return {
        isValid: false,
        errorMessage: "Reference solution code must not be empty.",
      };
    }

    if (question.testCases?.length === 0) {
      return {
        isValid: false,
        errorMessage: "At least one test case is required.",
      };
    }

    return {
      isValid: true,
      errorMessage: "",
    };
  };

  const handleSaveQuestionUpdate = () => {
    // for each question in updatedQuestions, check if the input is valid
    const areFormsValid = updatedQuestions.map((question) =>
      checkQuestionInputValidity(question)
    );

    if (areFormsValid?.every((result) => result.isValid)) {
      handleUpdateQuestions();
    } else {
      // see which question index is invalid
      const invalidQuestions = areFormsValid
        .map((result, index) => (result.isValid ? null : index))
        .filter((index) => index !== null);

      toast({
        title: "Invalid form",
        description: (
          <div>
            {invalidQuestions.map((index) => (
              <div key={index} className="my-2">
                Question {index + 1} has invalid input.
                <div>{areFormsValid[index]?.errorMessage}</div>
              </div>
            ))}
          </div>
        ),
        variant: "destructive",
      });
    }
  };

  const handleFinishEditing = () => {
    disableEditing();
    router.push(`/assignments/${params.id}`);
  };

  return isLoading ? (
    <LogoLoading />
  ) : (
    <div>
      <div className="my-2">
        <div className="flex">
          <Button color="danger" onClick={onOpen} className="ml-auto">
            <Icons.Cross /> Cancel
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <div>
                  <ModalHeader>Confirm exiting?</ModalHeader>
                  <ModalBody>
                    <p>Any changes made will not be saved after exit.</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={onClose}>
                      Return
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => {
                        handleFinishEditing();
                        onClose();
                      }}
                    >
                      Confirm
                    </Button>
                  </ModalFooter>
                </div>
              )}
            </ModalContent>
          </Modal>
        </div>
        <b>Update assignment details</b>
        <div className="my-4">
          <AssignmentEditor isEditing />
        </div>
      </div>

      <div className="my-4">
        <b>Update questions</b>

        <div className="mx-[8%] my-4">
          <div className="flex">
            <Tooltip content="Add more questions">
              <Button
                variant="bordered"
                className="bg-white ml-auto text-xl"
                onClick={handleAddQuestion}
                isIconOnly
              >
                <Icons.Add />
              </Button>
            </Tooltip>
          </div>

          {updatedQuestions.map((question, index) => {
            return (
              <div
                key={index}
                className="flex border px-4 py-10 my-2 justify-center"
              >
                <QuestionEditor
                  initialQuestion={question}
                  assignmentDeadline={assignment!.deadline}
                  onQuestionChange={(updatedQuestion) =>
                    handleQuestionChange(updatedQuestion, index)
                  }
                />

                <Button
                  className="bg-danger"
                  isIconOnly
                  onClick={() => handleDeleteQuestion(index)}
                  size="sm"
                  isDisabled={updatedQuestions.length === 1}
                >
                  <Icons.Delete className="text-lg text-white" />
                </Button>
              </div>
            );
          })}
          <div className="flex justify-end">
            <Button
              color="primary"
              type="submit"
              onClick={handleSaveQuestionUpdate}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
