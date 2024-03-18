import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { Metadata } from "next";

interface Props {
  params: {
    id: string
  };
};

export default function AssignmentPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}

export const generateMetadata = async ({ params }: Props) => {
  const assignmentTitle = (
    await AssignmentService.getAssignmentById({
      assignmentId: params.id,
    })
  ).title;

  const metadata: Metadata = {
    title: assignmentTitle,
    description: `Assignment page for ${assignmentTitle}`,
  };

  return metadata;
}
