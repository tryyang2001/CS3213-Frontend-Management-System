import { notFound } from "next/navigation";
import AssignmentQuestion from "./AssignmentQuestion";
import DateUtils from "../../utils/dateUtils";
import { Button } from "@nextui-org/react";

interface Props {
  assignment?: Assignment;
}

const AssignmentPage = ({ assignment }: Props) => {
  if (!assignment) {
    return notFound();
  }

  return (
    <div className="ml-[12%] mt-[5%] mr-[8%]">
      {/* Assignment Header */}
      <div className="flex gap-2">
        <div>
          <h1 className="text-3xl font-semibold ">{assignment.title}</h1>

          <div className="flex flex-col ml-4 my-4 gap-2">
            <p className="text-lg font-semibold">
              Due on:{" "}
              <span className="italic font-medium">
                {DateUtils.parseTimestampToDate(assignment.deadline)}
              </span>
            </p>
            <p className="text-lg font-semibold">
              Number of questions:{" "}
              <span className="italic font-medium">
                {assignment.numberOfQuestions}
              </span>
            </p>
          </div>
        </div>

        {/* Button for submission */}
        <div className="ml-auto mr-4 my-2">
          <Button className="px-6" color="primary">
            Submit
          </Button>
        </div>
      </div>

      {/* Assignment questions */}
      {assignment.questions.map((question) => {
        return <AssignmentQuestion question={question} key={question.id} />;
      })}
    </div>
  );
};

export default AssignmentPage;
