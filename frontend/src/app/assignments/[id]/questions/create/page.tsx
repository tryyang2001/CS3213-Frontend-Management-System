"use client";

import AssignmentPage from "@/components/assignment/AssignmentPage";
import QuestionEditor from "@/components/assignment/create/QuestionEditor";
import Icons from "@/components/common/Icons";
import LogoLoading from "@/components/common/LogoLoading";
import { useToast } from "@/components/ui/use-toast";
import { useAssignmentContext } from "@/contexts/assignment-context";
import { Button, Tooltip } from "@nextui-org/react";
import assignmentService from "@/helpers/assignment-service/api-wrapper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

function Page({ params }: Props) {
  const router = useRouter();

  const [questions, setQuestions] = useState<CreateQuestionBody[]>([
    {
      title: "",
      description: "",
    },
  ]);
  const [questionUniqueIds, setQuestionUniqueIds] = useState<string[]>([
    crypto.randomUUID(),
  ]);

  const { toast } = useToast();

  const { assignment, isNewlyCreated, disableAddingQuestion } =
    useAssignmentContext();

  useEffect(() => {
    return () => {
      disableAddingQuestion();
    };
  }, []);

  if (!assignment || !isNewlyCreated) {
    router.push(`/assignments/${params.id}`);
    return <LogoLoading />;
  }

  const handleQuestionChange = (
    updatedQuestion: CreateQuestionBody,
    index: number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;

    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        description: "",
      },
    ]);

    setQuestionUniqueIds([...questionUniqueIds, crypto.randomUUID()]);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, idx) => idx !== index)
    );

    setQuestionUniqueIds((prevIds) =>
      prevIds.filter((_, idx) => idx !== index)
    );
  };

  const handleSaveCreatedQuestions = () => {
    // create questions
    assignmentService
      .createQuestions(assignment.id, questions)
      .then(() => {
        // so that the user can't revisit this page again
        disableAddingQuestion();

        router.push(`/assignments/${assignment.id}`);
      })
      .catch((_err) => {
        toast({
          title: "Failed to create questions",
          description:
            "An error occurred while creating questions. Please check the inputs and try again.",
          variant: "destructive",
        });
      });
  };

  const checkQuestionInputValidity = (question: CreateQuestionBody) => {
    if (question.title.length === 0 || question.title.length > 255) {
      return {
        isValid: false,
        errorMessage: "Title must be between 1 and 255 characters",
      };
    }

    if (
      question.description.length === 0 ||
      question.description.length > 50000
    ) {
      return {
        isValid: false,
        errorMessage: "Description must be between 1 and 50000 characters",
      };
    }

    if (new Date(question.deadline as number) < new Date()) {
      return {
        isValid: false,
        errorMessage: "Deadline must be in the future",
      };
    }

    if (question.referenceSolution?.code.length === 0) {
      return {
        isValid: false,
        errorMessage: "Reference solution code must not be empty",
      };
    }

    if (question.testCases?.length === 0) {
      return {
        isValid: false,
        errorMessage: "Test cases must not be empty",
      };
    }

    return {
      isValid: true,
      errorMessage: "",
    };
  };

  const handleFinishQuestionsCreation = () => {
    const areFormsValid = questions.map((question) => {
      return checkQuestionInputValidity(question);
    });

    if (areFormsValid?.every((result) => result.isValid)) {
      handleSaveCreatedQuestions();
    } else {
      // see which question index is invalid
      const invalidQuestions = areFormsValid
        .map((result, index) => (result.isValid ? null : index))
        .filter((index) => index !== null);

      toast({
        title: "Invalid form",
        description: (
          <div>
            {invalidQuestions.map(
              (index) =>
                index !== null && (
                  <div key={index} className="my-2">
                    Question {index + 1} has invalid input.
                    <div>{areFormsValid[index]?.errorMessage}</div>
                  </div>
                )
            )}
          </div>
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-dvh">
      <div>
        <div className="ml-[5%] mr-[8%]">
          <AssignmentPage
            assignment={assignment}
            showNumberOfQuestions={false}
          />
        </div>

        <div className="border-b-2 my-2" />

        {/* Question editor */}
        <div className="mx-[8%] my-4">
          {questions.map((question, index) => (
            <div
              className="flex flex-col border px-4 pt-5 my-2 justify-center"
              key={questionUniqueIds[index]}
            >
              <div className="flex">
                <QuestionEditor
                  assignmentDeadline={assignment.deadline}
                  initialQuestion={question}
                  onQuestionChange={(updatedQuestion) =>
                    handleQuestionChange(updatedQuestion, index)
                  }
                />

                <Tooltip content="Delete current question">
                  <Button
                    className="bg-danger"
                    isIconOnly
                    onClick={() => handleDeleteQuestion(index)}
                    size="sm"
                    isDisabled={questions.length === 1}
                  >
                    <Icons.Delete className="text-lg text-white" />
                  </Button>
                </Tooltip>
              </div>

              {index === questions.length - 1 && (
                <div className="flex justify-end my-2 px-4">
                  <Tooltip content="Add more questions">
                    <Button
                      className="bg-white ml-auto text-xl"
                      variant="bordered"
                      onClick={handleAddQuestion}
                      isIconOnly
                    >
                      <Icons.Add />
                    </Button>
                  </Tooltip>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex mx-[8%]">
          <Button
            className="ml-auto mt-4"
            color="success"
            onClick={handleFinishQuestionsCreation}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Page;
