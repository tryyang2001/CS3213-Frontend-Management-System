import { Divider } from "@nextui-org/react";
import parse from "html-react-parser";

interface Props {
  question: Question;
}

const AssignmentQuestion = ({ question }: Props) => {
  return (
    <div className="flex px-0 py-4 mb-6">
      <div className="w-full px-5">
        {/* Question title */}
        <div className="flex space-x-4">
          <div className="flex-1 mr-2 text-xl font-semibold">
            {question.title}
          </div>
        </div>

        <Divider className="mt-4 mb-2" />

        {/* Question description */}
        <div className="flex mt-3">
          <div className="text-md text-justify">
            {parse(question.description)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentQuestion;
