"use client";

import AssignmentPage from "@/components/assignment/AssignmentPage";
import QuestionEditor from "@/components/assignment/create/QuestionEditor";
import Icons from "@/components/common/Icons";
import LogoLoading from "@/components/common/LogoLoading";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { Button, Spacer } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

function Page({ params }: Props) {
  const router = useRouter();

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

  const [questions, setQuestions] = useState<CreateQuestionBody[]>([
    {
      title: "",
      description: "",
    },
  ]);

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
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, idx) => idx !== index)
    );
  };

  const handleFinishQuestionsCreation = async () => {
    // create questions
    const createdQuestions = await AssignmentService.createQuestions(
      assignment!.id,
      questions
    );

    router.push(`/assignments/${assignment!.id}`);
  };

  if (isError || (isFetched && !assignment)) {
    return notFound();
  }

  return (
    <div className="h-screen">
      {isLoading ? (
        <LogoLoading />
      ) : (
        // show assignment details, such as title, description, deadline, etc.
        <div>
          <div className="ml-[5%] mr-[8%]">
            <AssignmentPage
              assignment={assignment!}
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
                  assignmentDeadline={assignment!.deadline}
                  initialQuestion={question}
                  onQuestionChange={(updatedQuestion) =>
                    handleQuestionChange(updatedQuestion, index)
                  }
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
      )}
    </div>
  );
}

export default Page;
