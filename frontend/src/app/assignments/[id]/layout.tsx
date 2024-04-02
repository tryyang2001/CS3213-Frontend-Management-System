import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { Metadata } from "next";

interface PageProps {
  params: {
    id: string;
  };
}

export default function AssignmentPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const currentAssignment = await AssignmentService.getAssignmentById(
    params.id
  );

  const assignmentTitle = currentAssignment?.title ?? "No such assignment";

  const metadata: Metadata = {
    title: assignmentTitle,
    description: `Assignment page for ${assignmentTitle}`,
  };

  return metadata;
};
