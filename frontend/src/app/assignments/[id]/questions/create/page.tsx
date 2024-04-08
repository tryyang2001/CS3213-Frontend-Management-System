"use client";

import AssignmentPage from "@/components/assignment/AssignmentPage";
import QuestionEditor from "@/components/assignment/create/QuestionEditor";
import Icons from "@/components/common/Icons";
import LogoLoading from "@/components/common/LogoLoading";
import { useToast } from "@/components/ui/use-toast";
import { useAssignmentContext } from "@/contexts/assignment-context";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const [isSubmittingQuestionForm, setIsSubmittingQuestionForm] =
    useState(false);
  const [areFormsValid, setAreFormsValid] = useState<boolean[]>();

  const { toast } = useToast();

  const { assignment, isNewlyCreated, disableAddingQuestion } =
    useAssignmentContext();

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
    setAreFormsValid((prevForms) => [...(prevForms ?? []), false]);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, idx) => idx !== index)
    );
    setAreFormsValid((prevForms) => {
      const updatedForms = [...(prevForms ?? [])];
      updatedForms.splice(index, 1);
      return updatedForms;
    });
  };

  const handleSaveCreatedQuestions = () => {
    // create questions
    AssignmentService.createQuestions(assignment.id, questions)
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

  const handleFinishQuestionsCreation = () => {
    setIsSubmittingQuestionForm(true);

    if (areFormsValid?.every((isValid) => isValid)) {
      handleSaveCreatedQuestions();
    } else {
      toast({
        title: "Invalid form",
        description:
          "Please make sure all questions are filled out correctly before submitting.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen">
      <div>
        <div className="ml-[5%] mr-[8%]">
          <AssignmentPage
            assignment={assignment}
            showNumberOfQuestions={false}
          />
        </div>

        <div className="border-b-2 my-2" />

        <div className="flex ml-4 my-2">
          <b className="flex items-center">Create new questions</b>
          <Button
            color="primary"
            className="ml-auto"
            onClick={handleAddQuestion}
          >
            Add more questions
          </Button>
        </div>

        {/* Question editor */}
        <div className="mx-[8%] my-4">
          {questions.map((question, index) => (
            <div
              className="flex border px-4 py-10 my-2 justify-center"
              key={index}
            >
              <QuestionEditor
                assignmentDeadline={assignment.deadline}
                initialQuestion={question}
                onQuestionChange={(updatedQuestion) =>
                  handleQuestionChange(updatedQuestion, index)
                }
                isSubmittingQuestionForm={isSubmittingQuestionForm}
                onFormSubmit={(isFormValid) => {
                  setAreFormsValid((prevForms) => {
                    const updatedForms = [...(prevForms ?? [])];
                    updatedForms[index] = isFormValid;
                    return updatedForms;
                  });
                }}
              />

              <Button
                className="bg-danger"
                isIconOnly
                onClick={() => handleDeleteQuestion(index)}
                size="sm"
                isDisabled={questions.length === 1}
              >
                <Icons.Delete className="text-lg text-white" />
              </Button>
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