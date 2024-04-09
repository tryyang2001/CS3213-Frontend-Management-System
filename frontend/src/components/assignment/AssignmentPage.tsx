import { notFound } from "next/navigation";
import DateUtils from "../../utils/dateUtils";
import parse from "html-react-parser";

interface Props {
  assignment: Assignment | null | undefined;
  showNumberOfQuestions?: boolean; //important as this component is reused in question creation form
}

function AssignmentPage({ assignment, showNumberOfQuestions = true }: Props) {
  if (!assignment) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold ">{assignment.title}</h1>

      <div className="flex flex-col ml-4 my-4 gap-2">
        <p className="text-lg font-semibold">
          Due on:{" "}
          <span className="italic font-medium">
            {DateUtils.parseTimestampToDate(assignment.deadline)}
          </span>
        </p>

        {showNumberOfQuestions && (
          <p className="text-lg font-semibold">
            Number of questions:{" "}
            <span className="italic font-medium">
              {assignment.numberOfQuestions}
            </span>
          </p>
        )}

        <div className="my-4">
          {assignment.description && parse(assignment.description)}
        </div>
      </div>
    </div>
  );
}

export default AssignmentPage;
