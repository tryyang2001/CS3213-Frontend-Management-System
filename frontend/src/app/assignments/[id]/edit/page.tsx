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
    if (assignment?.questions?.length ?? 0 > 0) {
      const questionIds = assignment!.questions!.map((question) => question.id);

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

      const questions: CreateQuestionBody[] = assignment!.questions!.map(
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

      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!assignment || !isEditing) {
      router.push(`/assignments/${params.id}`);
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
    console.log(updatedQuestions);

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
      .catch((error) => {
        console.error(error);
      });
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
            <Button color="primary" onClick={handleUpdateQuestions}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
