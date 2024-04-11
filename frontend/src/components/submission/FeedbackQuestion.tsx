import { Divider } from "@nextui-org/react";
import parse from "html-react-parser";

interface Props {
  question: Question;
}

export default function FeedbackQuestion({ question }: Props) {
  return (
    <div className="flex px-0 py-4 mb-6">
      <div className="w-full">
        <div className="flex space-x-4">
          <div className="flex-1 mr-2 text-xl font-semibold">
            {question.title}
          </div>
        </div>
        <Divider className="mt-4 mb-2" />
        <div className="flex flex-wrap mt-3 w-full">
          <div className="text-md text-justify w-full">
            {parse(question.description)}
          </div>
        </div>
      </div>
    </div>
  );
}
